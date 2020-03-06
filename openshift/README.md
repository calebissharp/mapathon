# Deploy on openshift

1. Select your namespace:
`oc project <your_openshift_namespace>`
1. Deploy image stream config:
`oc process -f openshift/image.yml | oc apply -f-`
1. Deploy build config:
`oc process -f openshift/buildconfig.yml GIT_REF=master | oc apply -f-`
`oc start-build mapproxy --follow`
1. Start deployment:
`oc process -f openshift/deploymentconfig.yml OC_PROJECT=<your_openshift_namespace> | oc apply -f-`
1. Deploy the service
`oc process -f openshift/service.yml | oc apply -f-`
