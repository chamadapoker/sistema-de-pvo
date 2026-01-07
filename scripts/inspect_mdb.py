
import pyodbc
import os

DB_PATH = r"C:\Users\Yoda\Downloads\DVD PVO 2010\PVO\MDB\Pvo.mdb"

def inspect_mdb():
    print(f"🕵️ Analisando banco de dados: {DB_PATH}")
    
    # Drivers comuns
    drivers = [driver for driver in pyodbc.drivers() if 'Access' in driver]
    print(f"Drivers Access detectados: {drivers}")
    
    if not drivers:
        print("❌ Nenhum driver Microsoft Access encontrado no sistema.")
        return

    conn_str = fr"DRIVER={{{drivers[0]}}};DBQ={DB_PATH};"
    
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()
        
        print("\n📋 Tabelas encontradas:")
        for table_info in cursor.tables(tableType='TABLE'):
            print(f"  - {table_info.table_name}")
            
            # Listar colunas da primeira tabela interessante
            if table_info.table_name not in ['Paste Errors', 'Switchboard Items']:
                print(f"    Colunas de {table_info.table_name}:")
                for row in cursor.columns(table=table_info.table_name):
                    print(f"      * {row.column_name} ({row.type_name})")
        
        conn.close()
        print("\n✅ Conexão bem sucedida!")
        
    except Exception as e:
        print(f"\n❌ Erro ao conectar: {e}")

if __name__ == "__main__":
    inspect_mdb()
