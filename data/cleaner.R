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
View(dat19)


colnames(dat19) = gsub("\\*", "", colnames(dat19))
colnames(dat18) = gsub("<strong>", "", colnames(dat18))
colnames(dat18) = gsub("</strong>", "", colnames(dat18))
colnames(dat17) = gsub("<strong>", "", colnames(dat17))
colnames(dat17) = gsub("</strong>", "", colnames(dat17))
  
commoncols = colnames(dat19)[which(colnames(dat19) %in% colnames(dat18))]
commoncols.idx = which(colnames(dat19) %in% colnames(dat18))
n = length(c(unlist(dat18[,1]), unlist(dat19[,1])))

df = data.frame(matrix(ncol = length(commoncols.idx), nrow = n))
for (i in 1:length(commoncols.idx)) { 
  idx.19 = commoncols.idx[i]
  name = colnames(dat19)[idx.19]
  idx.18 = which(colnames(dat18) == name)
  newcol = c(unlist(dat18[,idx.18]), unlist(dat19[,idx.19]))
  df[,i] = numeric(length(newcol))
  df[,i] = newcol
}
names(df) = commoncols
df

df1819 = mergeCols(dat19, dat18)

df1819
commoncols = colnames(df1819)[which(colnames(df1819) %in% colnames(dat17))]
commoncols.idx = which(colnames(df1819) %in% colnames(dat17))
n = length(c(unlist(dat17[,1]), unlist(dat1819[,1])))

df = data.frame(matrix(ncol = length(commoncols.idx), nrow = n))
for (i in 1:length(commoncols.idx)) { 
  idx.19 = commoncols.idx[i]
  name = colnames(df1819)[idx.19]
  idx.18 = which(colnames(dat17) == name)
  newcol = c(unlist(dat17[,idx.18]), unlist(dat1819[,idx.19]))
  df[,i] = numeric(length(newcol))
  df[,i] = newcol
}
names(df) = commoncols

View(df)

colnames()


colnames(dat18)[!(colnames(dat19) %in%commoncols)]
write.csv(colnames(dat19)[commoncols], file="included.csv")
write.csv(colnames(dat19)[-commoncols], file="notincluded.csv")
write.csv(df, 'df17_19.csv')



dat = merge(dat14, dat16, all = T)

dat1819 = Reduce(function(...) merge(..., all=TRUE), list(dat19, dat18))
length(colnames(dat1819))
length(colnames(dat19))
