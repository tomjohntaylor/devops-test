



# Prerequisites:
Make sure you have helm installed and minikube cluster started!
Make sure that you can run docker commands (if not modify commands below to use sudo)


# Cluster and application set-up 
## Commands list (start from git root directory)
```
# Images preparation
eval $(minikube docker-env)
docker build -t default-minikube/nodejs-catsapp:1 .
cd nginx/; docker build -t default-minikube/nginx-proxy:1 .; cd ..
docker pull mongo:5.0.3
docker tag mongo:5.0.3 default-minikube/mongo:5.0.3

# Minikube configuration
minikube addons enable ingress

# Charts installation
cd charts/; helm install nodejs-catsapp .; cd ..
```

After this steps mongo-db statefulset needs to be configured for replicasSet. It can be done by entering PRIMARY mongo-db container:
```
kubectl exec -it mongo-db-0 bash
```
and then in container:
```
root@mongo-db-0:/# mongo
rs.initiate({ _id: "MainRepSet", version: 1, 
members: [ 
 { _id: 0, host: "mongo-db-0.mongo-db.default.svc.cluster.local:27017" }, 
 { _id: 1, host: "mongo-db-1.mongo-db.default.svc.cluster.local:27017" }, 
 { _id: 2, host: "mongo-db-2.mongo-db.default.svc.cluster.local:27017" } ]});
```
Make sure the status is OK as follows (sometimes it's needeed to wait couple of seconds for every mongo replica to be ready):
```
{
        "ok" : 1,
        "$clusterTime" : {
(...)
}
```
```
# App openning in browser
python -mwebbrowser "http://$(minikube ip)/cats"
```


# Best practices taken into account in this demo:
1. Using small base images for fast deployment and avoiding security issues
1. NodeJS app image creted in production mode
1. Nginx proxy app image created from scratch for avoiding security issues
1. Apps initialized with initial resource limits
1. Using statefulset in case of DB containers
1. Using at least 2 replicas for deployments and 3 replicas for db statefulset


# Things todo before moving to production:
1. Using distributed cluster in cloud (ex. AWS EKS) with multi-region configuration or even worker nodes in different cloud services providers (ex. Google Cloud + AWS) to prevent downtimes
1. Configure app by using combination of configMap for standard configuration files or env variables (ex. nodeconfig package) and Secrets for sensitive data stored in env variabler rather than configuration files in containers (ex. dotenv package)
1. Secrets management using envelope encryption (ex. AWS EKS + AWS KMS)
1. Adding and fine-tunings health-checks to every resource where it is possible
1. Fine-tuning resource requests and limits
1. Using namespaces in case of many apps in cluster
1. Fine-tuning graceful termination time to make sure that pods termination proceeds correctly
1. Using object storage for static files serving (ex. AWS S3)
1. Consider using external Load balancer service (ex. AWS ELB) with combination of Kubernetes LoadBalancer service type rather than Kubernetes ingress
1. Using some kind of charts validation and good practices schema validator (ex. Datree) to prevent misconfiguration at the beginning of CICD pipelines (ex. making sure that there are no single points of failure in case of resource single replica)
1. Configuring staging and production environemts usins IaC (ex. Terraform of Python Boto3 for AWS)
1. Create CICD pipeline with automated execution of unit, integartion and functional tests
1. Consider using external database service, outside of Kubernetes cluster (ex. AWS RDS)

# Docker-compose
If you want you can use docker-compose also, simly run:
```
docker-compose up -d
```
and access the app via http://localhost:8080/cats
