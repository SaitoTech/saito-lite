#!/bin/bash

curl -o pandemic.zip http://www.vassalengine.org/mediawiki/images/9/96/Pandemic_All_3_Expansions_1.0.vmod
unzip pandemic.zip -d pandemic-vassal/
cp -a pandemic-vassal/images/. web/img/
rm -r pandemic.zip pandemic-vassal/
