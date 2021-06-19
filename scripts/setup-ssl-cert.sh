#!/usr/bin/env bash

set +x

YOUR_HOST=$1

while [ -z "$YOUR_HOST" ]
do
  echo "Please enter desired host name (i.e. local.maven.io), ensure it is resolvable either via hosts file or DNS:"
  read YOUR_HOST
done

echo "Going to configure with host $YOUR_HOST"

PREFIX=`echo $YOUR_HOST | cut -d. -f1`

if [ -f server.crt ]; then
  echo "Existing server.crt found, not going to regenerate - remove and rerun if you wish to regen."
else
  echo "Going to generate new custom cert"
  ~/workspaces/salish-sea/scripts/make-req-conf.rb $PREFIX > /tmp/req.conf
  ~/workspaces/salish-sea/scripts/setup_certs.sh /tmp/req.conf
fi

echo "You will want to ensure that you have imported server.crt custom certificate authority into Chrome, Windows, "
echo "MacOS, mobile device, your emulator etc. according to the specific native way for that system."
echo "Custom CA Cert Authority File Path: $(readlink -f server.crt)"

echo "Your updated environment file is at $ENV_FILE"

echo 'Now you may run "docker-compose up"'

echo "After the site is up and running, you can open up a browser and access the site at https://$YOUR_HOST"
