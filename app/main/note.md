# 此目录是主进程的代码所用

# 关于excel的有用的笔记

```
book = XLSX.readFile(msg);
book {
    Workbook: {
        Sheets: [
            {
               "name": "Sheet1",
               "sheetId": "1",
               "id": "rId1",
               "Hidden": 0
            },
        ]
    },
    Sheets: {
        [sheet name]: {
            "!ref": "A1:M63",
            "A1":{
                "t": "s",
                "v": "王春宇",
            }
        }
    }
}
```