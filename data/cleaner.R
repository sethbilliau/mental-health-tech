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
colnames(dat16) = gsub("<strong>", "", colnames(dat16))
colnames(dat16) = gsub("</strong>", "", colnames(dat16))


# Clean 19

colnames(dat19)
tocheck = c("If so, what disorder(s) were you diagnosed with?")
unique(dat19[,name])

options = c("Anxiety Disorder (Generalized, Social, Phobia, etc)", 
            "Mood Disorder (Depression, Bipolar Disorder, etc)",
            "Psychotic Disorder (Schizophrenia, Schizoaffective, etc)", 
            "Eating Disorder (Anorexia, Bulimia, etc)",
            "Attention Deficit Hyperactivity Disorder",
            "Personality Disorder (Borderline, Antisocial, Paranoid, etc)",
            "Obsessive-Compulsive Disorder", 
            "Post-traumatic Stress Disorder", 
            "Stress Response Syndromes", 
            "Dissociative Disorder", 
            "Substance Use Disorder", 
            "Addictive Disorder", 
            "Other")

dat.edited = dat19

library(pracma)
n = dim(dat19)[1]
for (option in options){ 
  print(option)
  temp = numeric(n)
  for (idx in 1:nrow(dat19)){ 
    row = dat19[idx, name]
    
    temp[idx] = strcmp(option, unlist(row[1]))
    
    
  }
  
  dat.edited = cbind(dat.edited, temp)
}
colnames(dat.edited) = c(colnames(dat19), options)

dat19 = dat.edited

# Clean 16 
dat.edited = dat16
n = dim(dat16)[1]
for (option in options){ 
  print(option)
  temp = numeric(n)
  for (idx in 1:nrow(dat16)){ 
    row = dat19[idx, name]
    
    temp[idx] = strcmp(option, unlist(row[1]))
    
    
  }
  
  dat.edited = cbind(dat.edited, temp)
}
colnames(dat.edited) = c(colnames(dat16), options)

dat16 = dat.edited


# Clean 18 and 17 


for (option in options) {
  fun = function(x ) grepl(option, x, fixed= T)
  indices = which(unlist(lapply(colnames(dat18),fun )))
  if (strcmp(option, "other")) { 
    indices = which(grepl(option, colnames(dat18) ))[1:3]
  }

  dat18[,option] = apply(!apply(dat18[,indices], 2, is.na), 1, sum)
}


for (option in options) {
  fun = function(x ) grepl(option, x, fixed= T)
  indices = which(unlist(lapply(colnames(dat17),fun )))
  if (strcmp(option, "other")) { 
    indices = which(grepl(option, colnames(dat17) ))[1:3]
  }
  
  dat17[,option] = apply(!apply(dat17[,indices], 2, is.na), 1, sum)
}



  
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
n = length(c(unlist(dat17[,1]), unlist(df1819[,1])))

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


# Df 17-19 write 
write.csv(df1719, 'df17_19.csv')
 

barplot(table(as.factor(df1719$`What is your race?`)))
df_race = data.frame(x=table(as.factor(df1719$`What is your race?`)))

ggplot(df_race, aes(x=x.Var1, y = x.Freq)) + 
  geom_bar(stat="identity", color="blue", fill="white") +
  labs(title = "Posterior Correlation X1 and X2") +
  theme(plot.title = element_text(hjust = 0.5)) 
gender = df1719$`What is your gender?`
gender[which(grepl("female", gender))] = 'F'
gender[which(grepl("Female", gender))] = 'F'
gender[which(grepl("woman", gender))] = 'F'
gender[which(grepl("Woman", gender))] = 'F'
gender[which(grepl("f", gender))] = 'F'
gender[which(grepl("male", gender))] = 'M'
gender[which(grepl("Male", gender))] = 'M'
gender[which(grepl("man", gender))] = 'M'
gender[which(grepl("Man", gender))] = 'M'
gender[which(grepl("m", gender))] = 'M'
gender[which(grepl("MALE", gender))] = 'M'
gender[which(grepl("SWM", gender))] = 'M'
gender[which( gender != "M" & gender != "F")] = 'Other'
table(gender)
df1719$`What is your gender?` = as.factor(gender)

     
write.csv(df1719, 'df17_19.csv')



### Add 16

# Get common columns 
commoncols.add16 = colnames(df1719)[which(colnames(df1719) %in% colnames(dat16))]
commoncols.idx.add16 = which(colnames(df1719) %in% colnames(dat16))
n = length(c(unlist(dat16[,1]), unlist(df1719[,1])))

# Build New dataset 
df1619 = data.frame(matrix(ncol = length(colnames(df1719)), nrow = n))
for (i in 1:length(commoncols.add16)) { 
  idx.19 = commoncols.idx.add16[i]
  name = colnames(df1719)[idx.19]
  idx.16 = which(colnames(dat16) == name)
  newcol = c(unlist(dat16[,idx.16]), unlist(df1719[,idx.19]))
  df1619[,i] = numeric(length(newcol))
  df1619[,i] = newcol
}
colnames(df1619)[1:length(commoncols.add16)] = commoncols.add16



uncommoncols.add16 = colnames(df1719)[which(!(colnames(df1719) %in% colnames(dat16)))]
uncommoncols.idx.add16 = which(!(colnames(df1719) %in% colnames(dat16)))

for (i in 1:length(uncommoncols.add16)) { 
  idx.19 = uncommoncols.idx.add16[i]
  name = colnames(df1719)[idx.19]
  newcol = c(rep(NA, length(unlist(dat16[,1]))), unlist(df1719[,idx.19]))
  df1619[,(i+length(commoncols.add16))] = numeric(length(newcol))
  df1619[,(i+length(commoncols.add16))] = newcol
}
colnames(df1619)[(length(commoncols.add16) + 1):(length(commoncols.add16) + length(uncommoncols.add16))] = uncommoncols.add16


df1619$`What is your race?`[1809:2000]

View(df1619)
write.csv(df1619, 'df16_19.csv')

df =df1619[which(!is.na( df1619[,options[1] ])), ]
df$year


gender = df1619$`What is your gender?`
gender[which(grepl("female", gender))] = 'F'
gender[which(grepl("Female", gender))] = 'F'
gender[which(grepl("woman", gender))] = 'F'
gender[which(grepl("Woman", gender))] = 'F'
gender[which(grepl("f", gender))] = 'F'
gender[which(grepl("male", gender))] = 'M'
gender[which(grepl("Male", gender))] = 'M'
gender[which(grepl("man", gender))] = 'M'
gender[which(grepl("Man", gender))] = 'M'
gender[which(grepl("m", gender))] = 'M'
gender[which(grepl("MALE", gender))] = 'M'
gender[which(grepl("SWM", gender))] = 'M'
gender[which( gender != "M" & gender != "F")] = 'Other'
table(gender)
df1619$`What is your gender?` = as.factor(gender)


write.csv(df1619, 'df16_19_clean.csv')






     