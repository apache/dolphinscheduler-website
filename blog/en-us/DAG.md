## Big Data Workflow Task Scheduling - Directed Acyclic Graph (DAG) for Topological Sorting

### Reviewing the basics：

#### Graph traversal：

A graph traversal is a visit to all the vertices in a graph once and only once, starting from a vertex in the graph and following some search method along the edges of the graph.

Note : the tree is a special kind of graph, so tree traversal can actually be seen as a special kind of graph traversal.

#### There are two main algorithms for graph traversal

##### Breadth First Search (BFS)

The basic idea: first visit the starting vertex v, then from v, visit each of v's unvisited adjacent vertices w1, w2 , ... ,wi, then visit all the unvisited adjacent vertices of w1, w2, ... , wi in turn; from these visited vertices, visit all their unvisited adjacent vertices until all vertices in the graph have been visited. and from these visited vertices, visit all their unvisited adjacent vertices, until all vertices in the graph have been visited. If there are still vertices in the graph that have not been visited, choose another vertex in the graph that has not been visited as the starting point and repeat the above process until all vertices in the graph have been visited.

##### Depth First Search (DFS)

The basic idea: first visit a starting vertex v in the graph, then from v, visit any vertex w~1~ that is adjacent to v and has not been visited, then visit any vertex w~2~ that is adjacent to w~1~ and has not been visited ...... Repeat the above process. When it is no longer possible to go down the graph, go back to the most recently visited vertex, and if it has adjacent vertices that have not been visited, continue the search process from that point until all vertices in the graph have been visited.

#### Example

In the diagram below, if the breadth first search (BFS) is used, the traversal is as follows: `1 2 5 3 4 6 7`. If the depth first search (DFS) is used, the traversal is as follows `1 2 3 4 5 6 7`.

![DAG01](https://github.com/apache/dolphinscheduler-website/blob/master/img/DAG/DAG01.png?raw=true)

### Topological Sorting

The definition of topological ordering on Wikipedia is : 

For any Directed Acyclic Graph (DAG), the topological sorting is a linear sorting of all its nodes (there may be multiple such node sorts in the same directed graph). This sorting satisfies the condition that for any two nodes U and V in the graph, if there is a directed edge pointing from U to V, then U must appear ahead of V in the topological sorting.

**In layman's terms: Topological sorting is a linear sequence of all vertices of a directed acyclic graph (DAG), which must satisfy two conditions :**

-    Each vertex appears and only appears once.
-    If there is a path from vertex A to vertex B, then vertex A appears before vertex B in the sequence.

**How to find out its topological sort? Here is a more commonly used method :**

Before introducing this method, it is necessary to add the concepts of indegree and outdegree of a directed graph node.

Assuming that there is no directed edge whose starting point and ending point are the same node in a directed graph, then:

In-degree: Assume that there is a node V in the graph, and the in-degree is the number of edges that start from other nodes and end at V. That is, the number of all directed edges pointing to V.

Out-degree: Assuming that there is a node V in the directed graph, the out-degree is the number of edges that currently have a starting point of V and point to other nodes. That is, the number of edges issued by V.

1.   Select a vertex with an in-degree of 0 from the DAG graph and output it.
2.   Delete the vertex and all directed edges starting with it from the graph.
3.   Repeat 1 and 2 until the current DAG graph is empty or there are no vertices of degree 0 in the current graph. The latter case indicates that a ring must exist in the directed graph.

**For example, the following DAG graph :**

![DAG02](https://github.com/apache/dolphinscheduler-website/blob/master/img/DAG/DAG02.png?raw=true)


|Node|in degree|out degree|count of in degree|count of out degree|
|----|----|----|----|----|
|Node 1|0|Node 2,Node 4|0|2|
|Node 2|Node 1|Node 3,Node 4|1|2|
|Node 3|Node 2,Node 4|Node 5|2|1|
|Node 4|Node 1,Node 2|Node 3,Node 5|2|2|
|Node 5|Node 3,Node 4|0|2|0|

**Its topological sorting process is:**

![DAG03](https://github.com/apache/dolphinscheduler-website/blob/master/img/DAG/DAG03.png?raw=true)

Therefore, the result of topological sorting is: {1,2,4,3,5}.

If there is no node 2 —> the arrow of node 4, then it is as follows:

![DAG04](https://github.com/apache/dolphinscheduler-website/blob/master/img/DAG/DAG04.png?raw=true)

We can get its topological sort as: {1,2,4,3,5} or {1,4,2,3,5}, that is, for the same DAG graph, there may be multiple topological sort results .

Topological sorting is mainly used to solve the dependency problem in directed graphs.

**When talking about the implementation, it is necessary to insert the following : **

From this we can further derive an improved depth first search or breadth first search algorithm to accomplish topological sorting. Taking the breadth first search as an example, the only difference between this improved algorithm and the ordinary breadth first search is that we should save the degree of entry corresponding to each node and select the node with a degree of entry of 0 at each level of the traversal to start the traversal (whereas the ordinary breadth first search has no such restriction and can start from any node in the tale). The algorithm is described as follows :

1.   Initialize a Map or similar data structure to save the in-degree of each node.
2.   For the child nodes of each node in the graph, add 1 to the in-degree of its child nodes.
3.   Select any node with an in-degree of 0 to start traversal, and add this node to the output.
4.   For each node traversed, update the in-degree of its child node: subtract 1 from the in-degree of the child node.
5.   Repeat step 3 until all nodes have been traversed.
6.   If it is impossible to traverse all the nodes, it means that the current graph is not a directed acyclic graph. There is no topological sort.

**The core Java code for breadth first search topological sorting is as follows :**

```java
public class TopologicalSort {
  /**
   * Determine whether there is a ring and the result of topological sorting
   *
   * Only directed acyclic graph (DAG) has topological sorting
   * The main methods of breadth first search:
   *    1、Iterate over all the vertices in the graph, and put the vertices whose in-degree is 0 into the queue.
   *    2、A vertex is polled from the queue, and the in-degree of the adjacent point of the vertex is updated (minus 1). If the in-degree of the adjacent point is reduced by 1 and then equals to 0, the adjacent point is entered into the queue.
   *    3、Keep executing step 2 until the queue is empty.
   * If it is impossible to traverse all the vertics, it means that the current graph is not a directed acyclic graph. There is no topological sort.
   *
   *
   * @return key returns the state, true if successful (no-loop), value if failed (loop), value is the result of topological sorting (could be one of these)
   */
  private Map.Entry<Boolean, List<Vertex>> topologicalSort() {
 // Node queue with an in-degree of 0
    Queue<Vertex> zeroIndegreeVertexQueue = new LinkedList<>();
    // Save the results
    List<Vertex> topoResultList = new ArrayList<>();
    // Save the nodes whose in-degree is not 0
    Map<Vertex, Integer> notZeroIndegreeVertexMap = new HashMap<>();

    // Scan all nodes and queue vertices with in-degree 0
    for (Map.Entry<Vertex, VertexInfo> vertices : verticesMap.entrySet()) {
      Vertex vertex = vertices.getKey();
      int inDegree = getIndegree(vertex);

      if (inDegree == 0) {
        zeroIndegreeVertexQueue.add(vertex);
        topoResultList.add(vertex);
      } else {
        notZeroIndegreeVertexMap.put(vertex, inDegree);
      }
    }
    
 // After scanning, there is no node with an in-degree of 0, indicating that there is a loop, and return directly
    if(zeroIndegreeVertexQueue.isEmpty()){
      return new AbstractMap.SimpleEntry(false, topoResultList);
    }

    // Using the topology algorithm, delete the node with an in-degree of 0 and its associated edges
    while (!zeroIndegreeVertexQueue.isEmpty()) {
      Vertex v = zeroIndegreeVertexQueue.poll();
      // Get the adjacent nodes
      Set<Vertex> subsequentNodes = getSubsequentNodes(v);

      for (Vertex subsequentVertex : subsequentNodes) {

        Integer degree = notZeroIndegreeVertexMap.get(subsequentVertex);

        if(--degree == 0){
          topoResultList.add(subsequentVertex);
          zeroIndegreeVertexQueue.add(subsequentVertex);
          notZeroIndegreeVertexMap.remove(subsequentVertex);
        }else{
          notZeroIndegreeVertexMap.put(subsequentVertex, degree);
        }

      }
    }

    //notZeroIndegreeVertexMap If it is empty, it means there is no ring
    AbstractMap.SimpleEntry resultMap = new AbstractMap.SimpleEntry(notZeroIndegreeVertexMap.size() == 0 , topoResultList);
    return resultMap;

  }
}
```

*Notice: the output result is one of the topological sorting sequences of the graph.*

Every time a vertex is taken from a set with an in-degree of 0, there is no special rule for taking out. The order of taking the vertices will result in a different topological sorting sequence (if the graph has multiple sorting sequences).

Since each vertex is outputted with the edges starting from it removed. If the graph has V vertices and E edges, the time complexity of the algorithm is typically O(V+E). The final key of the algorithm as implemented here returns the state, true if it succeeds (no rings), with  rings if it fails, and value if there are no rings as the result of topological sorting (which may be one of these). Note that the output is one of the topologically sorted sequences of the graph. 
