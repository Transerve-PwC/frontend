# !bin/sh
# add an ssh config named `digit` to ~/.ssh/config
#   Host digit
#   user ubuntu
#   Hostname ec2-13-234-18-119.ap-south-1.compute.amazonaws.com
#   IdentityFile ~/.ssh/digit_dev_server.pem 
# 
sshconfig=digit
builddir=build
citizenzipname=citizen.zip
employeezipname=employee.zip
citizenrootremotedir=/home/ubuntu/dev/frontend/citizen
employeerootremotedir=/home/ubuntu/dev/frontend/employee

# bootstrap lerna

lerna bootstrap

# build citizen

npm run prod:citizen

# zip citizen build folder

cd packages/citizen/

rm -rf $citizenzipname

zip -r -q $citizenzipname $builddir 

# remove remote build folder
ssh $sshconfig "rm -rf $citizenrootremotedir/$builddir"

# copy build to remote folder

scp $citizenzipname digit:$citizenrootremotedir

# Unzip remote folder to deploy the application.
ssh $sshconfig "unzip -q $citizenrootremotedir/$citizenzipname -d $citizenrootremotedir"

# Clean up local zip

rm -rf $citizenzipname

echo "citizen frontend app deployed"

# build employee
cd ../..

npm run prod:employee

# zip employee build folder

cd packages/employee/

rm -rf $employeezipname

zip -r -q $employeezipname $builddir 

# remove remote build folder
ssh $sshconfig "rm -rf $employeerootremotedir/$builddir"

# copy build to remote folder

scp $employeezipname digit:$employeerootremotedir

# Unzip remote folder to deploy the application.
ssh $sshconfig "unzip -q $employeerootremotedir/$employeezipname -d $employeerootremotedir"

# Clean up local zip

rm -rf $employeezipname

echo "employee frontend app deployed"