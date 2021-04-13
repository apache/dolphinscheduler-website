### Load Balance

Load balancing refers to the reasonable allocation of server pressure through routing algorithms (usually in cluster environments) to achieve the maximum optimization of server performance.



### DolphinScheduler-Worker load balancing algorithms

DolphinScheduler-Master allocates tasks to workers, and by default provides three algorithms:

Weighted random (random)

Smoothing polling (roundrobin)

Linear load (lowerweight)

The default configuration is the linear load.

As the routing is done on the client side, the master service, you can change master.host.selector in master.properties to configure the algorithm what you want.

eg: master.host.selector = random (case-insensitive)

### Worker load balancing configuration

The configuration file is worker.properties

#### weight

All of the above load algorithms are weighted based on weights, which affect the outcome of the triage. You can set different weights for different machines by modifying the worker.weight value.

####  Preheating

With JIT optimisation in mind, we will let the worker run at low power for a period of time after startup so that it can gradually reach its optimal state, a process we call preheating. If you are interested, you can read some articles about JIT.

So the worker will gradually reach its maximum weight over time after it starts (by default ten minutes, we don't provide a configuration item, you can change it and submit a PR if needed).

### Load balancing algorithm breakdown

#### Random (weighted)

This algorithm is relatively simple, one of the matched workers is selected at random (the weighting affects his weighting).

#### Smoothed polling (weighted)

An obvious drawback of the weighted polling algorithm. Namely, under certain specific weights, weighted polling scheduling generates an uneven sequence of instances, and this unsmoothed load may cause some instances to experience transient high loads, leading to a risk of system downtime. To address this scheduling flaw, we provide a smooth weighted polling algorithm.

Each worker is given two weights, weight (which remains constant after warm-up is complete) and current_weight (which changes dynamically), for each route. The current_weight + weight is iterated over all the workers, and the weight of all the workers is added up and counted as total_weight, then the worker with the largest current_weight is selected as the worker for this task. current_weight-total_weight.

#### Linear weighting (default algorithm)

The algorithm reports its own load information to the registry at regular intervals. We base our judgement on two main pieces of information

-    load average (default is the number of CPU cores * 2)
-    available physical memory (default is 0.3, in G)

If either of the two is lower than the configured item, then this worker will not participate in the load. (no traffic will be allocated)

You can customise the configuration by changing the following properties in worker.properties

-    worker.max.cpuload.avg = -1(only less than cpu avg load, worker server can work. default value -1: the number of cpu cores * 2 )

-    worker.reserved.memory = 0.3(only larger than reserved memory, worker server can work. default value : physical memory * 1/6, unit is G. )
