# A Formidable Combination of Lizhi Machine Learning Platform& DolphinScheduler Creates New Paradigm for Data Process in the Future

>Editor's word: The online audio industry is a blue ocean market in China nowadays. According to CIC data, the market size of China’s online audio industry has grown from 1.6 billion yuan in 2016 to 13.1 billion yuan in 2020, with a compound annual growth rate of 69.4%. With the popularity of the Internet of Things, audio has permeated into various terminals mobiles, vehicles, smart hardware, home equipment, and other various scenarios, sequentially to maximize the accompanying advantages of audio carriers.

>In recent years, domestic audio communities have successfully been listed one after another. Among them, Lizhi was listed on NASDAQ in 2020 as the first “online audio” stock, which has more than 200 million users at present. In the information age, the audio industry also faces the generation of massive UGC data on the platform. On one hand, the users and consumers of audio content expect high-efficiency information transmission; on the other hand, the internet audio platforms hope that information can be accurately and quickly pushed to users while ensuring the security of platform UGC content. To process massive data most efficiently, major audio platforms are seeking methods to combine the increasingly mature machine learning technology with big data scheduling systems. Lizhi’s Machine Learning Intelligent Recommendation Platform is having a try by combining the machine learning platform with the big data scheduling system DolphinScheduler.

## Background

<div align=center>
<img src="https://s1.imgpp.com/2021/11/23/radio-g360707f44_1920.md.jpg"/>
</div>

Lizhi is a fast-growing UGC audio community company that attaches great importance to AI and data analysis technology development. AI can find the right voice for each user among the massively fragmented audios, and build it into a sustainable ecological closed loop. And data analysis can guide the company’s fast-growing business. Both of the two fields need to process massive amounts of data and require a big data scheduling system.

Before the beginning of 2020, Lizhi used the Azkaban scheduling system. Although the big data scheduling SQL/shell/python scripts and other big data-related modules can complete the entire AI process, it is not easy and reusable enough. The machine learning platform is a set of systems built specifically for AI, which abstracts the AI development paradigm, i.e. data acquisition, data preprocessing, model training, model prediction, model evaluation, and model release into modules. Each module provides multiple implementations and is connected in series by DAG to achieve low-code development by drag-and-drop configuration.
## Challenges During Machine Learning Platform Development
During the machine learning platform development, Lizhi has some clear requirements for the scheduling system:

1. It should be able to store and calculate massive data, such as screening samples, generating portraits, feature preprocessing, distributed model training, etc.;

2. The DAG execution engine is required, and the processes such as data acquisition -> data preprocessing -> model training -> model prediction -> model evaluation -> model release should be executed in series with DAG.

In the development by Azkaban, the team encountered some challenges:

Challenge 1: The development model is cumbersome, which requires the user to package scripts and build DAG dependencies, and there is no implementation of DAG drag and drop;

Challenge 2: The modules are not rich enough, and the scripted AI modules are not universal enough, thus the team need to develop modules repeatedly, which is unnecessary and error-prone;

Challenge 3: Stand-alone deployment, the system is unstable and prone to failures. Besides, Task jams can easily cause downstream tasks to fail.

## Turn to DolphinScheduler

After stepping on numerous pits in the old system, the Lizhi machine learning team, including recommendation system engineers Haibin Yu, Yanbin Lin, Huanjie Xie, and Yifei Guo, decided to adopt DolphinScheduler.

Currently, 1,600+ processes and 12,000+ tasks (IDC) are running smoothly on DolphinScheduler every day.

Haibin Yu said that the majority of the users of the scheduling system are recommendation algorithms engineers> data analysts> risk control algorithms engineers> business developers (importance decreased in order). Not all of them are masters of data management operations, and DolphinScheduler perfectly meets their needs for a simple, easy-to-use, drag-and-drop scheduling system:

1. Distributed decentralized architecture and fault tolerance mechanism to ensure the high availability of the system;

2. Visual DAG drag-and-drop UI, easy to use, and iterates quickly;

3. It supports various modules, and can simply develop and integrate its modules;

4. The community is active, hence there are no worries about the project supports;

5. It is very close to the operating mode of the machine learning platform, using DAG to drag and drop UI programming.

## Use Case

After selecting the DolphinScheduler, the Lizhi machine learning platform carries out re-development based on it and applies the achievements to actual business scenarios, which are mainly about recommendation and risk control. Recommendation scenarios cover recommendation of voice, anchor, live broadcast, podcast, friend, etc., and risk control scenarios cover risk control in payment, advertising, and comment, etc.
At the technical level of the platform, Lizhi optimizes the extended modules for the five paradigms of machine learning, i.e. obtaining training samples, data preprocessing, model training, model evaluation, and model release.

A simple xgboost case:

<div align=center>
<img src="https://s1.imgpp.com/2021/11/23/1.png"/>
</div>

### 1. Obtaining training samples

At present, Lizhi does not directly select data from Hive, and joins the union, splitting the sample afterward, but directly processes the sample by shell nodes.

<div align=center>
<img src="https://s1.imgpp.com/2021/11/23/2.png"/>
</div>

### 2. Data preprocessing

Transformer& custom preprocessing configuration file, use the same configuration for online training, and feature preprocessing is performed after the feature is obtained. It contains the itemType and its feature set to be predicted, the user’s userType and its feature set, as well as the associated and crossed itemType and its feature set. Define the transformer function for each feature preprocessing, supports custom transformer and hot update, xgboost, and tf model feature preprocessing. After the node process, the data format that is needed for model training is prepared. This configuration file will also be brought along when the model is released to keep training and online prediction consistent. This file is maintained in the resource center of DolphinScheduler.

<div align=center>
<img src="https://s1.imgpp.com/2021/11/23/2.png"/>
</div>


### 3. Xgboost training

It supports w2v, xgboost, tf model training modules. The training modules are first packaged with TensorFlow or PyTorch and then packaged into DolphinScheduler modules.
For example, in the xgboost training process, use Python to package the xgboost training script into the xgboost training node of DolphinScheduler, and show the parameters required for training on the interface. The file exported by “training set data preprocessing” is input to the training node through HDFS.

<div align=center>
<img src="https://s1.imgpp.com/2021/11/23/3.png"/>
</div>

### 4. Model release


The release model will send the model and preprocessing configuration files to HDFS and insert records into the model release table. The model service will automatically identify the new model, update the model, and provide online prediction services to the external.

<div align=center>
<img src="https://s1.imgpp.com/2021/11/23/4.png"/>
</div>


Haibin Yu said that due to historical and technical limitations, Lizhi has not yet built a machine learning platform like Ali PAI, but the practice has proved that similar platform functions can be achieved based on DolphinScheduler.

In addition, Lizhi has also carried out many re-developments based on DolphinScheduler to make the scheduling system more in line with actual business needs, such as:

1. Pop-up the window of whether to set timing when defining the workflow

2. Add display pages for all workflow definitions to facilitate searching
 
  a) Add the workflow definition filter and jump to the workflow instance page, and use a line chart to show the change of its running time
  b) The workflow instance continues to dive to the task instance

3. Enter parameters during runtime to configure the disabled task nodes

## Machine Learning Platform based on Scheduling System May Lead the Future Trend

Deep learning is a leading trend in the future. Lizhi has developed new modules for deep learning models. The entire tf process has been completed yet, and LR and GBDT model-related modules are also in the plan. The latter two deep learning models are relatively more simple, easier to get started, faster to iterate, and can be used in generally recommended scenarios. After implementation, the Lizhi machine learning platform can be more complete.
Lizhi believes that if the scheduling system can be improved in terms of kernel stability, drag-and-drop UI support, convenient modules' expansion, task plug-in, and task parameter transfer, building the machine learning platform based on the scheduling system may become a common practice in the industry.
