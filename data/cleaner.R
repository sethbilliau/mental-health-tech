# CLEANER CS171

# Libraries
library(tidyverse)

readAndAddYear = function(year) { 
  strname = paste("survey", year, ".csv", sep = '')
  dat = read_csv(strname)
  dat['year'] = year
  return(dat)
}

# dat14 = readAndAddYear(2014)
dat16 = readAndAddYear(2016)
dat17 = readAndAddYear(2017)
dat18 = readAndAddYear(2018)
dat19 = readAndAddYear(2019)

# Clean column names 
colnames(dat19) = gsub("\\*", "", colnames(dat19))
colnames(dat18) = gsub("<strong>", "", colnames(dat18))
colnames(dat18) = gsub("</strong>", "", colnames(dat18))
colnames(dat17) = gsub("<strong>", "", colnames(dat17))
colnames(dat17) = gsub("</strong>", "", colnames(dat17))
  
# Get common columns 
commoncols.1819 = colnames(dat19)[which(colnames(dat19) %in% colnames(dat18))]
commoncols.idx.1819 = which(colnames(dat19) %in% colnames(dat18))
n = length(c(unlist(dat18[,1]), unlist(dat19[,1])))

# Create new dataset 
df1819 = data.frame(matrix(ncol = length(commoncols.idx.1819), nrow = n))
for (i in 1:length(commoncols.idx.1819)) { 
  idx.19 = commoncols.idx.1819[i]
  name = colnames(dat19)[idx.19]
  idx.18 = which(colnames(dat18) == name)
  newcol = c(unlist(dat18[,idx.18]), unlist(dat19[,idx.19]))
  df1819[,i] = numeric(length(newcol))
  df1819[,i] = newcol
}
names(df1819) = commoncols.1819

### Merge 17-19
# Get common columns 
commoncols.full = colnames(df1819)[which(colnames(df1819) %in% colnames(dat17))]
commoncols.idx.full = which(colnames(df1819) %in% colnames(dat17))
n = length(c(unlist(dat17[,1]), unlist(dat1819[,1])))

# Build New dataset 
df1719 = data.frame(matrix(ncol = length(commoncols.idx.full), nrow = n))
for (i in 1:length(commoncols.idx.full)) { 
  idx.19 = commoncols.idx.full[i]
  name = colnames(df1819)[idx.19]
  idx.17 = which(colnames(dat17) == name)
  newcol = c(unlist(dat17[,idx.17]), unlist(df1819[,idx.19]))
  df1719[,i] = numeric(length(newcol))
  df1719[,i] = newcol
}
names(df1719) = commoncols.full
View(df1719)

# Df 17-19 write 
write.csv(df1719, 'df17_19.csv')




table(as.factor(df1719$`What US state or territory do you live in?`))

     