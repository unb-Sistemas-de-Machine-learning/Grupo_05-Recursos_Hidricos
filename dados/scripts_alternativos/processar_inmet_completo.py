#!/usr/bin/env python3
"""
Script para processar dados históricos do INMET (2015-2024)
Foco: Estações meteorológicas do Distrito Federal
"""

import pandas as pd
import zipfile
import os
from glob import glob
import re
from datetime import datetime

def extrair_dados_df(anos=range(2015, 2025)):
    """
    Extrai dados das estações do DF de todos os anos
    """
    print("\n" + "="*70)
    print("PROCESSAMENTO DE DADOS METEOROLÓGICOS DO INMET (2015-2024)")
    print("="*70 + "\n")
    
    base_dir = "/home/ubuntu/inmet_historico"
    
    # Estações do DF
    estacoes_df = {
        'A001': 'BRASILIA',
        'A042': 'BRAZLANDIA', 
        'A045': 'AGUAS_EMENDADAS',
        'A046': 'GAMA_PONTE_ALTA',
        'A047': 'PARANOA_COOPA_DF'
    }
    
    # Dicionário para armazenar dados por estação
    dados_por_estacao = {codigo: [] for codigo in estacoes_df.keys()}
    
    # Processar cada ano
    for ano in anos:
        zip_file = f"{base_dir}/{ano}.zip"
        
        if not os.path.exists(zip_file):
            print(f"⚠️  Arquivo {ano}.zip não encontrado")
            continue
            
        print(f"\n📁 Processando ano {ano}...")
        
        try:
            with zipfile.ZipFile(zip_file, 'r') as zip_ref:
                # Listar arquivos do DF no ZIP
                arquivos_df = [f for f in zip_ref.namelist() if '_DF_' in f and f.endswith('.CSV')]
                
                print(f"   Encontrados {len(arquivos_df)} arquivos do DF")
                
                for arquivo in arquivos_df:
                    # Identificar a estação
                    estacao_codigo = None
                    for codigo in estacoes_df.keys():
                        if f'_{codigo}_' in arquivo:
                            estacao_codigo = codigo
                            break
                    
                    if not estacao_codigo:
                        continue
                    
                    print(f"   ├── {estacoes_df[estacao_codigo]} ({estacao_codigo})")
                    
                    try:
                        # Ler o CSV do ZIP
                        with zip_ref.open(arquivo) as f:
                            # INMET usa encoding latin-1 e separador ;
                            df = pd.read_csv(f, 
                                           encoding='latin-1', 
                                           sep=';',
                                           skiprows=8,  # Pular cabeçalho do INMET
                                           na_values=['-9999', '-999', ''])
                            
                            # Adicionar coluna de estação
                            df['ESTACAO_CODIGO'] = estacao_codigo
                            df['ESTACAO_NOME'] = estacoes_df[estacao_codigo]
                            df['ANO'] = ano
                            
                            dados_por_estacao[estacao_codigo].append(df)
                            
                            print(f"   │   ✓ {len(df)} registros extraídos")
                            
                    except Exception as e:
                        print(f"   │   ✗ Erro ao processar: {str(e)[:50]}")
                        continue
                        
        except Exception as e:
            print(f"✗ Erro ao abrir {ano}.zip: {e}")
            continue
    
    # Consolidar dados
    print("\n" + "-"*70)
    print("CONSOLIDANDO DADOS...")
    print("-"*70 + "\n")
    
    dados_consolidados = {}
    
    for codigo, nome in estacoes_df.items():
        if dados_por_estacao[codigo]:
            print(f"📊 {nome} ({codigo})")
            df_estacao = pd.concat(dados_por_estacao[codigo], ignore_index=True)
            print(f"   Total de registros: {len(df_estacao):,}")
            print(f"   Período: {df_estacao['ANO'].min()} - {df_estacao['ANO'].max()}")
            
            # Salvar CSV individual
            output_file = f"/home/ubuntu/inmet_{codigo}_{nome}_{df_estacao['ANO'].min()}-{df_estacao['ANO'].max()}.csv"
            df_estacao.to_csv(output_file, index=False, encoding='utf-8')
            print(f"   ✓ Salvo em: {output_file}\n")
            
            dados_consolidados[codigo] = df_estacao
        else:
            print(f"⚠️  {nome} ({codigo}): Nenhum dado encontrado\n")
    
    # Criar dataset consolidado de TODAS as estações
    if dados_consolidados:
        print("-"*70)
        print("CRIANDO DATASET CONSOLIDADO...")
        print("-"*70 + "\n")
        
        df_todas = pd.concat(dados_consolidados.values(), ignore_index=True)
        
        print(f"📈 Dataset Consolidado (Todas as Estações do DF)")
        print(f"   Total de registros: {len(df_todas):,}")
        print(f"   Estações: {df_todas['ESTACAO_CODIGO'].nunique()}")
        print(f"   Anos: {df_todas['ANO'].min()} - {df_todas['ANO'].max()}")
        print(f"   Colunas: {len(df_todas.columns)}")
        
        # Salvar dataset consolidado
        output_all = "/home/ubuntu/inmet_df_todas_estacoes_2015-2024.csv"
        df_todas.to_csv(output_all, index=False, encoding='utf-8')
        print(f"\n   ✓ Dataset consolidado salvo em: {output_all}")
        
        # Criar versão agregada diária (média de todas as estações)
        print("\n" + "-"*70)
        print("CRIANDO AGREGAÇÃO DIÁRIA...")
        print("-"*70 + "\n")
        
        # Tentar identificar coluna de data
        colunas_data = [col for col in df_todas.columns if 'DATA' in col.upper() or 'DATE' in col.upper()]
        
        if colunas_data:
            col_data = colunas_data[0]
            print(f"   Coluna de data identificada: {col_data}")
            
            try:
                # Converter para datetime
                df_todas[col_data] = pd.to_datetime(df_todas[col_data], errors='coerce')
                
                # Criar coluna de data apenas (sem hora)
                df_todas['DATA_DIARIA'] = df_todas[col_data].dt.date
                
                # Identificar colunas numéricas para agregar
                colunas_numericas = df_todas.select_dtypes(include=['float64', 'int64']).columns
                colunas_numericas = [col for col in colunas_numericas if col not in ['ANO']]
                
                print(f"   Colunas numéricas para agregar: {len(colunas_numericas)}")
                
                # Agrupar por data e calcular médias
                df_diario = df_todas.groupby('DATA_DIARIA')[colunas_numericas].mean().reset_index()
                
                print(f"\n   ✓ {len(df_diario)} dias com dados agregados")
                
                # Salvar agregação diária
                output_diario = "/home/ubuntu/inmet_df_agregado_diario_2015-2024.csv"
                df_diario.to_csv(output_diario, index=False, encoding='utf-8')
                print(f"   ✓ Dados diários salvos em: {output_diario}")
                
            except Exception as e:
                print(f"   ✗ Erro ao criar agregação diária: {e}")
        else:
            print("   ⚠️  Coluna de data não identificada")
        
        # Estatísticas gerais
        print("\n" + "="*70)
        print("ESTATÍSTICAS GERAIS")
        print("="*70 + "\n")
        
        print("Colunas disponíveis:")
        for i, col in enumerate(df_todas.columns, 1):
            print(f"   {i:2d}. {col}")
        
        return df_todas
    
    else:
        print("\n✗ Nenhum dado foi consolidado!")
        return None

def main():
    # Processar todos os dados
    df_completo = extrair_dados_df()
    
    if df_completo is not None:
        print("\n" + "="*70)
        print("✅ PROCESSAMENTO CONCLUÍDO COM SUCESSO!")
        print("="*70)
        print("\nArquivos gerados:")
        print("  1. CSVs individuais por estação (A001, A042, A045, A046, A047)")
        print("  2. CSV consolidado de todas as estações")
        print("  3. CSV com agregação diária (média de todas as estações)")
        print("\n")
    else:
        print("\n" + "="*70)
        print("✗ ERRO NO PROCESSAMENTO")
        print("="*70 + "\n")

if __name__ == "__main__":
    main()
