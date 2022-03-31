# Hareware Environment

DolphinScheduler, as an open-source distributed workflow task scheduling system, can be well deployed and run in Intel architecture server environments and mainstream virtualization environments, and supports mainstream Linux operating system environments.

## 1. Linux operating system version requirements

| OS       | Version         |
| :----------------------- | :----------: |
| Red Hat Enterprise Linux | 7.0 and above   |
| CentOS                   | 7.0 and above   |
| Oracle Enterprise Linux  | 7.0 and above   |
| Ubuntu LTS               | 16.04 and above |

> **Attention:**
>The above Linux operating systems can run on physical servers and mainstream virtualization environments such as VMware, KVM, and XEN.

## 2. Recommended server configuration
DolphinScheduler supports 64-bit hardware platforms with Intel x86-64 architecture. The following recommendation is made for server hardware configuration in a production environment:
### Production Environment

| **CPU** | **MEM** | **HD** | **NIC** | **Num** |
| --- | --- | --- | --- | --- |
| 4 core+ | 8 GB+ | SAS | GbE | 1+ |

> **Attention:**
> - The above-recommended configuration is the minimum configuration for deploying DolphinScheduler. The higher configuration is strongly recommended for production environments.
> - The hard disk size configuration is recommended by more than 50GB. The system disk and data disk are separated.


## 3. Network requirements

DolphinScheduler provides the following network port configurations for normal operation:

| Server | Port | Desc |
|  --- | --- | --- |
| MasterServer |  5678  | Not the communication port. Require the native ports do not conflict |
| WorkerServer | 1234  | Not the communication port. Require the native ports do not conflict |
| ApiApplicationServer |  12345 | Backend communication port |

> **Attention:**
> - MasterServer and WorkerServer do not need to enable communication between the networks. As long as the local ports do not conflict.
> - Administrators can adjust relevant ports on the network side and host-side according to the deployment plan of DolphinScheduler components in the actual environment.

## 4. Browser requirements

DolphinScheduler recommends Chrome and the latest browsers which using Chrome Kernel to access the front-end visual operator page.

