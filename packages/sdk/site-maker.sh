#!/bin/bash

# https://deliciousbrains.com/ssl-certificate-authority-for-local-https-development/

echo "building $1"
cp -r ../../civil-sdk-example ../../civil-sdk-example-$1
HOST=$1.local
CERT_DIR=../../civil-sdk-example-$1/cert
rm $CERT_DIR/*
CERT_PREFIX=$CERT_DIR/server

echo "HEY $HOST || $CERT_DIR || $CERT_PREFIX"
ls $CERT_PREFIX
openssl genrsa -out $CERT_PREFIX.key 2048
openssl req -new -key $CERT_PREFIX.key -out $CERT_PREFIX.csr

printf "authorityKeyIdentifier=keyid,issuer\nbasicConstraints=CA:FALSE\nkeyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment\nsubjectAltName = @alt_names\n[alt_names]\nDNS.1 = $HOST\n" >> $CERT_PREFIX.ext

openssl x509 -req -in $CERT_PREFIX.csr -CA ~/.ssh/myCA.pem -CAkey ~/.ssh/myCA.key -CAcreateserial \
 -out $CERT_PREFIX.crt -days 1825 -sha256 -extfile $CERT_PREFIX.ext


CMD="echo \"127.0.0.1       $HOST\" >> /etc/hosts"
sudo sh -c "$CMD"