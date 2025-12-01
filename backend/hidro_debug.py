"""Script auxiliar para diagnosticar respostas do HidroWebservice (ANA).

Uso:
  - Configure as variáveis de ambiente em `backend/.env` ou no ambiente:
      HIDRO_IDENTIFICADOR, HIDRO_SENHA, HIDRO_BASE_URL (opcional)
  - Opcional: habilitar debug com HIDRO_DEBUG=1
  - Execute:
      python hidro_debug.py --route serie_chuva --codigo <codigo> --de 2024-01-01 --ate 2024-01-31

O script tenta chamadas e imprime o JSON bruto e alguns cabeçalhos para ajudar a entender
por que a API retorna `items: []` com a mensagem "Não houve retorno de registros...".
"""

import os
import argparse
import json
from hidro_api import HidroClient


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--route", choices=["serie_chuva","serie_cota","serie_vazao"], default="serie_chuva")
    p.add_argument("--codigo", required=True)
    p.add_argument("--de", required=True)
    p.add_argument("--ate", required=True)
    args = p.parse_args()

    # Habilita logs verbosos do cliente
    os.environ.setdefault("HIDRO_DEBUG", "1")

    client = HidroClient()

    if args.route == "serie_chuva":
        js = client.serie_chuva(args.codigo, args.de, args.ate)
    elif args.route == "serie_cota":
        js = client.serie_cota(args.codigo, args.de, args.ate)
    else:
        js = client.serie_vazao(args.codigo, args.de, args.ate)

    print("\n--- JSON RESPONSE (truncated) ---\n")
    try:
        print(json.dumps(js, ensure_ascii=False, indent=2)[:10000])
    except Exception:
        print(str(js)[:10000])

    print("\n--- Done ---\n")


if __name__ == "__main__":
    main()
