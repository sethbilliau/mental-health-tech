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

df = data.frame(matrix(ncol = 60, nrow = length(newcol)))
for (col in commoncols) { 
  newcol = c(unlist(dat18[,col]), unlist(dat19[,col]))
  df[,col] = numeric(length(newcol))
  df[,col] = newcol
}
View(df)




dat = merge(dat14, dat16, all = T)

dat1819 = Reduce(function(...) merge(..., all=TRUE), list(dat19, dat18))
length(colnames(dat1819))
length(colnames(dat19))
