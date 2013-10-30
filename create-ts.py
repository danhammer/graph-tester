import pandas as pd
import numpy as np
from datetime import datetime
import json

df = pd.io.parsers.read_csv("../data/ndmi.csv")

names = list(set(df['facility']))

res = {}
for name in names:
    
    fac_res = {}

    def toDict(row):
        d = datetime.strptime(row[4], '%Y-%m-%d')
        date = d.strftime('%s')
        return {'x': int(date), 'y': row[5]}

    subs = df[df['facility'] == name]
    subs_ma = subs.copy()
    subs_ma['ndmi'] = pd.rolling_mean(subs['ndmi'], 14)

    subs    = subs[13::]
    subs_ma = subs_ma[13::]

    s  = map(toDict, np.array(subs))
    sm = map(toDict, np.array(subs_ma))

    fac_res['raw'] = s
    fac_res['ma']  = sm

    res[name] = fac_res


with open('data.json', 'w') as outfile:
  json.dump(res, outfile)
