# CLEANER Manually augmented

# Libraries
df1619 = read.csv("manual_1619.csv")
df1619$What.is.your.gender.
gender = df1619$What.is.your.gender.
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
df1619$What.is.your.gender. = as.factor(gender)

write.csv(df1619, 'df1619CleanFromSheets.csv')
