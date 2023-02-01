import json

sources = {
    'f1': {
        'address': 'https://www.formula1.com/en/latest/all.html',
        'base': 'https://www.formula1.com/'
    },
    'skyf1': {
        'address': 'https://www.skysports.com/f1/news',
        'base': ''
    },
    'BBCF1': {
        'address': 'https://www.bbc.com/sport/formula1',
        'base': 'https://www.bbc.com/'
    },
    'WTF1': {
        'address': 'https://wtf1.com/topics/formula-1/',
        'base': 'https://wtf1.com/topics/formula-1/'
    },
    'autosport': {
        'address': 'https://www.autosport.com/f1/news/',
        'base': 'https://www.autosport.com/'
    }
}

with open('f1sources.json', 'w') as jf:
    json.dump(sources, jf)
