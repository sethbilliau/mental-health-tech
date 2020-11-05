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

commoncols = colnames(dat19)[which(colnames(dat19) %in% colnames(dat18))]
length(colnames(dat18))
length(commoncols)
rbind(dat19[,commoncols], dat18[,commoncols])

commoncols.idx = which(colnames(dat19) %in% colnames(dat18))

df = data.frame(matrix(ncol = 60, nrow = length(newcol)))
for (i in 1:length(commoncols.idx)) { 
  idx.19 = commoncols.idx[i]
  name = colnames(dat19)[idx.19]
  idx.18 = which(colnames(dat18) == name)
  newcol = c(unlist(dat18[,idx.18]), unlist(dat19[,idx.19]))
  df[,i] = numeric(length(newcol))
  df[,i] = newcol
}
names(df) = commoncols
View(df)



write.csv(colnames(dat19)[commoncols.idx], file="included.csv")
write.csv(colnames(dat19)[-commoncols.idx], file="notincluded.csv")
write.csv(df, 'fullincluded.csv')



dat = merge(dat14, dat16, all = T)

dat1819 = Reduce(function(...) merge(..., all=TRUE), list(dat19, dat18))
length(colnames(dat1819))
length(colnames(dat19))
