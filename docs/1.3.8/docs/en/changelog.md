# Change Log

## Features/Updates

[#5405] [Improvement]Docker & K8s Improvement Plan Round 2
[#5858][improvement][Docker] Docker image should support multi-arch like arm64 in docker-compose
[#5706][improvement][common] Upgrade the version of fastjson from 1.2.61 to 1.2.75
[#5577][improvement][UI] Add Project Name in Project Page
[#5567][improvement][UI] Add project id in web ui url for sharing
[#5475][improvement][Api] Upload resource to remote failed, the local tmp file need to be cleared
[#5468][improvement][Net]Optimize IP acquisition in complex network environment
[#5467][improvement][UI] UI cannot be displayed normally in some browsers

## Bug Fixes

[#6007][bug][Worker] fix Wrong complement date
[#5719][bug][K8s] Ingress ERROR io.k8s.api.networking.v1beta1.IngressSpec.tls: got "map", expected "array" On TLS enabled  
[#5701][bug][UI][dao]When deleting a user, the accessToken associated with the user should also be deleted
[#5699][bug][UI] Update user error in user information
[#5596][bug][Python] Conflict between python_home and datax_home configuration in dolphinscheduler_env.sh
[#5559][bug][Master Server] Master Server was shutdown but the process still in system
[#5581][bug][Mysql] Specific key was too long, max key length is 767 bytes for varchar(256) in some mysql with innodb_large_prefix=OFF
[#5578][bug][Master] ServerNodeManager WorkerGroupListener capture data change and get data failed
[#5570][bug][Worker] worker.groups in worker.properties is still commented after installation in 1.3.6
[#5550][bug][Master] remove check with executePath when kill yarn job
[#5549][bug][Worker] SqlTask NPE
[#5431][bug][K8s] Master and worker cannot get the right address with custom DNS in 1.3.6
