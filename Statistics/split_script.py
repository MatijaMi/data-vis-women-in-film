import pandas as pd

from numpy.core.numeric import NaN

df = pd.read_csv("complete_data.csv")
output = df.copy(deep=True)

counter = 0
for value in df["MOB"]:
    value = str(value)
    if value == "nan":
        counter = counter + 1
        continue
    else:
        split = value.split(" ")
        if len(split) > 1:
            output.loc[counter, "DOB"] = split[1]
            output.loc[counter, "MOB"] = split[0]
            counter = counter + 1
        else:
            counter = counter + 1

counter = 0
for value in df["MOD"]:
    value = str(value)
    if value == "nan":
        counter = counter + 1
        continue
    else:
        split = value.split(" ")
        print(split)
        if len(split) > 1:
            output.loc[counter, "DOD"] = split[1]
            output.loc[counter, "MOD"] = split[0]
            counter = counter + 1
        else:
            counter = counter + 1

output.to_csv("data_modified.csv")
