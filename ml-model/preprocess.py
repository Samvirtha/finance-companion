import pandas as pd

def load_and_clean_data(path):
    df = pd.read_csv(path)

    # Keep only expenses
    df = df[df['Transaction Type'] == 'debit']

    # Convert date
    df['Date'] = pd.to_datetime(df['Date'])

    # Feature engineering
    df['Hour'] = df['Date'].dt.hour
    df['Weekend'] = (df['Date'].dt.dayofweek >= 5).astype(int)

    # Encode category
    df['Category'] = df['Category'].astype('category').cat.codes

    return df