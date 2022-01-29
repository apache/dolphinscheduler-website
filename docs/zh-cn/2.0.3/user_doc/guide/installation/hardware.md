# 建议配置

DolphinScheduler 作为分布式工作流任务调度系统，可以部署运行于 Intel 架构服务器、虚拟化环境，各Linux操作系统环境

## Linux 版本要求

| 操作系统       | 版本         |
| :----------------------- | :----------: |
| Red Hat Enterprise Linux | 7.0 及以上   |
| CentOS                   | 7.0 及以上   |
| Oracle Enterprise Linux  | 7.0 及以上   |
| Ubuntu LTS               | 16.04 及以上 |

> **注意：**
>以上 Linux 操作系统可运行在物理服务器以及 VMware、KVM、XEN 主流虚拟化环境上

## 服务器配置

| **CPU** | **内存** | **硬盘类型** | **网络** | **实例数量** |
| --- | --- | --- | --- | --- |
| 4核+ | 8 GB+ | SAS | 千兆网卡 | 1+ |

> **注意：**
> - 上述部署 DolphinScheduler 为最低配置
> - 硬盘大小配置建议 50GB+ ，系统盘、数据盘分离


## 网络端口配置

| 组件 | 默认端口 | 说明 |
|  --- | --- | --- |
| MasterServer |  5678  | 非通信端口，只需本机端口不冲突即可 |
| WorkerServer | 1234  | 非通信端口，只需本机端口不冲突即可 |
| ApiApplicationServer |  12345 | 提供后端通信端口 |


> **注意：**
> - MasterServer 和 WorkerServer 不需要开启网络间通信
> - 管理员根据实际环境 DolphinScheduler 组件部署方案，开放网络侧、主机侧相关端口

## 浏览器配置

使用较新版本浏览器访问前端可视化操作界面
