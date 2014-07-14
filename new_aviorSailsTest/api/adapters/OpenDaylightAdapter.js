var toClient = require('../../toClient.js');
var http = require('http');

var FROM_OFP = {
	// name-in-models: name-in-opendaylight
	MAC_Address: 'dataLayerAddress',
	IP_Address: 'networkAddress',
	VLAN_ID: 'vlan',
	DPID: 'nodeId',
	Port: 'nodeConnectorId',
    Priority: 'priority', 
    IdleTimeout: 'idleTimeout', 
    HardTimeout: 'hardTimeout', 
    ID: 'id',  //flow id and dpid are both id.
    TableID: 'tableId',
    DurationSeconds:'durationSeconds', 
    DurationNanoSeconds:'durationNanoseconds',
    PacketCount:'packetCount',
    ByteCount:'byteCount',
    RXPackets:'receivePackets',
    TXPackets:'transmitPackets',
    RXBytes:'receiveBytes',
    TXBytes:'transmitBytes', 
    RXDrops:'receiveDrops', 
    TXDrops:'transmitDrops', 
    RXErrors:'receiveErrors',
    TXErrors:'transmitErrors', 
    RXFrameErr:'receiveFrameError',
    RXOverrunErr:'receiveOverRunError',
    RXCrcErr:'receiveCrcError',
    Collisions:'collisionCount', 
};

var TO_OFP = {
	// name-in-opendaylight: name-in-models
	dataLayerAddress: 'MAC_Address',
	networkAddress: 'IP_Address',
	vlan: 'VLAN_ID',
	nodeId: 'DPID',
	nodeConnectorId: 'Port',
    //ODL includes many object/array labels that FL doesn't, such as the below.
    hostConfig: 'Stats',
    flowStatistics: 'Stats',
    //node: 'AttachedTo',
    flowStatistic: 'Stats',
    flow: 'Stats',
    match: 'Match',
    matchField: 'MatchField',
    type: 'Type', //switch type or match type?
    value: 'Value', //this is used a lot
    actions: 'Actions',
    port: 'Port',
    
    priority: 'Priority',
    idleTimeout: 'IdleTimeout',
    hardTimeout: 'HardTimeout',
    //id: 'ID', //flow id and dpid are both id.
    tableId: 'TableID',
    durationSeconds: 'DurationSeconds',
    durationNanoseconds: 'DurationNanoSeconds',
    packetCount: 'PacketCount',
    byteCount: 'ByteCount',
    
    portStatistics: 'Stats',
    portStatistic: 'Stats',
    nodeConnector: 'Port',
    receivePackets: 'RXPackets',
    transmitPackets: 'TXPackets',
    receiveBytes: 'RXBytes',
    transmitBytes: 'TXBytes',
    receiveDrops: 'RXDrops',
    transmitDrops: 'TXDrops',
    receiveErrors: 'RXErrors',
    transmitErrors: 'TXErrors',
    receiveFrameError: 'RXFrameErr',
    receiveOverRunError: 'RXOverrunErr',
    receiveCrcError: 'RXCrcErr',
    collisionCount: 'Collisions',
    
    properties: 'Stats',
    tables: 'Tables',
    actions: 'Actions',
    macAddress: 'MAC_Address',
    capabilities: 'Capabilities',
    buffers: 'Buffers',
    
    tableStatistics: 'Stats',
    tableStatistic: 'Stats',
    activeCount: 'ActiveCount',
    lookupCount: 'LookupCount',
    matchedCount: 'MatchedCount',
    maximumEntries: 'MaxEntries', 
    
    nodeProperties: '',
    
    //topology
    edgeProperties: 'Stats',
    edge: 'Stats',
    tailNodeConnector: 'Stats',
    headNodeConnector: 'Stats',
    node: 'Stats',
    id: 'PortNum', //other ids?
    properties: 'Port',
    state: 'PortState', 
    config: 'PortConfig',
    //timestamp
    //bandwidth
    name: 'PortName',
    
    // topology modified by nodeparse, not odl
    SourceDPID: 'SourceDPID',
    SourcePortNum: 'SourcePortNum',
    DestionationDPID: 'DestionationDPID',
    DestionationPortNum: 'DestionationPortNum',
    
    
    
};

// Creates a function that, when called, will make a REST API call
var restCall = function(apiMethod,apiPath){
        //var self = this;
        return function(options,cb){
                if (options.args){ 
                        for (arg in options.args){
                                apiPath = apiPath.replace(/:[A-Za-z]+:/, options.args[arg]);
                        }
                }
                opts = {method:apiMethod,hostname:'localhost',port:8080,path:apiPath,auth:'admin:admin'}; //TODO: mask auth
                req = http.request(opts, toClient(this,options.call,cb));
                if (options.data) {
                        req.write(JSON.stringify(options.data));
                }
                req.end();
        }
};

module.exports = {
	identity: 'opendaylight',

        registerConnection: function (conn, coll, cb) {
                if (!conn.port) { conn.port = 8080; }
                if (!conn.method) { conn.method = 'GET'; }
                cb();
        },

        find: function (conn, coll, options, cb) {
                switch (coll){
                
                //fake calls for front-end
                case 'uptime': return 'uptime';
                        break;    
                case 'health': return 'health';
                        break;    
                case 'memory': return 'memory'
                        break;    
                //core
                case 'flow': return this.getFlowStats({args:['default'],call:coll},cb);
                        break;
                case 'switchports': return this.getPortStats({args:['default'],call:coll},cb);
                         break;
                case 'table': return this.getTableStats({args:['default'],call:coll},cb);
                         break;
                case 'topology': return this.getTopology({args:['default'],call:coll},cb);
                         break;
                case 'topologylinks': return this.getTopologyLinks({args:['default'],call:coll},cb);
                         break;
                case 'host': return this.getHosts({args:['default'],call:coll},cb);
                         break;
                case 'flows': return this.getFlows({args:['default'],call:coll},cb);
                         break;
                case 'switchfeatures': return this.getNodes({args:['default'],call:coll},cb);
                         break;
                case 'flowspec': return this.getFlowSpecs({args:['default'],call:coll},cb);
                         break;
                        
                //odl only        
                case 'staticroute': return this.getStaticRoutes({args:['default'],call:coll},cb);
                         break;
                case 'subnet': return this.getSubnets({args:['default'],call:coll},cb);
                         break;
                case 'flowspec': return this.getFlowSpecs({args:['default'],call:coll},cb);
                         break;
                case 'container': return this.getContainers({args:['default'],call:coll},cb);
                         break;
                case 'nodecluster': return this.getNodeCluster({args:['default'],call:coll},cb);
                         break;
		        default: return cb();
                        break;
                }
        },
    
        create: function (conn, coll, options, cb) {
                switch (coll){
                case 'flow': return this.addFlow();
		        default: return cb();
                }
        },
    
        update: function (conn, coll, options, cb) {
                switch (coll){
                
		        default: return cb();
                }
        },
    
        destroy: function (conn, coll, options, cb) {
                switch (coll){
                case 'flow': return this.deleteFlow();
		        default: return cb();
                }
        },
    
    
    //Statistics API
    getFlowStats: restCall('GET', '/controller/nb/v2/statistics/:containerName:/flow'),
            
    getFlowStatsByNode: restCall('GET', '/controller/nb/v2/statistics/:containerName:/flow/node/:nodeType:/:nodeId:'),
            
    getPortStats: restCall('GET', '/controller/nb/v2/statistics/:containerName:/port'),
            
    getPortStatsByNode: restCall('GET', '/controller/nb/v2/statistics/:containerName:/port/node/:nodeType:/:nodeId:'),
            
    getTableStats: restCall('GET', '/controller/nb/v2/statistics/:containerName:/table'), 
            
    getTableStatsByNode: restCall('GET', '/controller/nb/v2/statistics/:containerName:/table/node/:nodeType:/:nodeId:'), 
    
    
    //Topology API
    getTopology:restCall('GET', '/controller/nb/v2/topology/:containerName:'), 
        
    addTopologyLinks: restCall('PUT', '/controller/nb/v2/topology/:containerName:/userLink/:name:'), 
        
    deleteTopologyLinks: restCall('DELETE', '/controller/nb/v2/topology/:containerName:/userLink/:name:'), 
        
    getTopologyLinks: restCall('GET', '/controller/nb/v2/topology/:containerName:/userLinks'), 
    
    
    //Host API
    getHost: restCall('GET', '/controller/nb/v2/hosttracker/:containerName:/address/:networkAddress:'), 
        
    addHost: restCall('PUT', '/controller/nb/v2/hosttracker/:containerName:/address/:networkAddress:'), 
            
    deleteHost: restCall('DELETE', '/controller/nb/v2/hosttracker/:containerName:/address/:networkAddress:'), 
            
    getHosts: restCall('GET', '/controller/nb/v2/hosttracker/:containerName:/hosts/active'),
   
    getInactiveHosts:restCall('GET', '/controller/nb/v2/hosttracker/:containerName:/hosts/inactive'),
    
       
    //Flow API
    getFlows: restCall('GET', '/controller/nb/v2/flowprogrammer/:containerName:'), 
        
    getFlowsByNode: restCall('GET', '/controller/nb/v2/flowprogrammer/:containerName:/node/:nodeType:/:nodeId:'), 
            
    getFlow: restCall('GET', '/controller/nb/v2/flowprogrammer/:containerName:/node/:nodeType:/:nodeId:/staticFlow/:name:'), 
     
    addFlow: restCall('PUT', '/controller/nb/v2/flowprogrammer/:containerName:/node/:nodeType:/:nodeId:/staticFlow/:name:'), 
            
    deleteFlow: restCall('DELETE', '/controller/nb/v2/flowprogrammer/:containerName:/node/:nodeType:/:nodeId:/staticFlow/:name:'),
            
    toggleFlow: restCall('POST', '/controller/nb/v2/flowprogrammer/:containerName:/node/:nodeType:/:nodeId:/staticFlow/:name:'),
    
    
    //Static Route API        
    getStaticRoute: restCall('GET', '/controller/nb/v2/staticroute/:containerName:/route/:route:'), 
            
    addStaticRoute: restCall('PUT', '/controller/nb/v2/staticroute/:containerName:/route/:route:'), 
         
    deleteStaticRoute: restCall('DELETE', '/controller/nb/v2/staticroute/:containerName:/route/:route:'), 
            
    getStaticRoutes: restCall('GET', '/controller/nb/v2/staticroute/:containerName:/routes'), 
    
    
    //Subnet API
    getSubnet: restCall('GET', '/controller/nb/v2/subnetservice/:containerName:/subnet/:subnetName:'), 
            
    addSubnet: restCall('PUT', '/controller/nb/v2/subnetservice/:containerName:/subnet/:subnetName:'), 
            
    deleteSubnet: restCall('DELETE', '/controller/nb/v2/subnetservice/:containerName:/subnet/:subnetName:'), 
                    
    modSubnet: restCall('POST', '/controller/nb/v2/subnetservice/:containerName:/subnet/:subnetName:'), 
                    
    getSubnets: restCall('GET', '/controller/nb/v2/subnetservice/:containerName:/subnets'),
    
    
    //Switch API                
    getNodeConnectors: restCall('GET', '/controller/nb/v2/switchmanager/:containerName:/node/:nodeType:/:nodeId:'),
                    
    getNodeProperty: restCall('GET', '/controller/nb/v2/switchmanager/:containerName:/node/:nodeType:/:nodeId:/property/:propertyName:'),
    
    deleteNodeProperty: restCall('DELETE', '/controller/nb/v2/switchmanager/:containerName:/node/:nodeType:/:nodeId:/property/:propertyName:'),
                    
    addNodeProperties: restCall('PUT', ' /controller/nb/v2/switchmanager/:containerName:/node/:nodeType:/:nodeId:/property/:propertyName:/:propertyValue:'), 
                    
    deleteNodeConnectorProperty: restCall('DELETE', '/controller/nb/v2/switchmanager/:containerName:/nodeconnector/:nodeType:/:nodeId:/:nodeConnectorType:/:nodeConnectorId:/property/:propertyName:'), 
                    
    addNodeConnectorProperty: restCall('PUT', '/controller/nb/v2/switchmanager/:containerName:/nodeconnector/:nodeType:/:nodeId:/:nodeConnectorType:/:nodeConnectorId:/property/:propertyName:/:propertyValue:'), 
                    
    getNodes: restCall('GET', '/controller/nb/v2/switchmanager/:containerName:/nodes'), 
                    
    saveNodes: restCall('POST', '/controller/nb/v2/switchmanager/:containerName:/save'), 
    
    
    //User API                
    addUser: restCall('POST', '/controller/nb/v2/usermanager/users'),
                  
    deleteUser: restCall('DELETE', '/controller/nb/v2/usermanager/users/:userName:'), 
    
    
    //Container API
    getContainer: restCall('GET', '/controller/nb/v2/containermanager/container/:container:'), 
    
    createContainer: restCall('PUT', '/controller/nb/v2/containermanager/container/:container:'), 
    
    deleteContainer: restCall('DELETE', '/controller/nb/v2/containermanager/container/:container:'), 
    
    getFlowSpec: restCall('GET', '/controller/nb/v2/containermanager/container/:container:/flowspec/:flowspec:'), 
        
    addFlowSpec: restCall('PUT', '/controller/nb/v2/containermanager/container/:container:/flowspec/:flowspec:'),
                    
    deleteFlowSpec: restCall('DELETE', '/controller/nb/v2/containermanager/container/:container:/flowspec/:flowspec:'), 
                    
    getFlowSpecs: restCall('GET', '/controller/nb/v2/containermanager/container/:container:/flowspecs'), 
    
    addNodeConnectors: restCall('PUT', '/controller/nb/v2/containermanager/container/:container:/nodeconnector'),
                    
    removeNodeConnectors: restCall('DELETE', '/controller/nb/v2/containermanager/container/:container:/nodeconnector'), 
    
    getContainers: restCall('GET', '/controller/nb/v2/containermanager/containers'), 
    
    
    //Connection API
    addMgmtConnectionWithoutNodeType: restCall('PUT', '/controller/nb/v2/connectionmanager/node/:nodeId:/address/:ipAddress:/port/:port:'),
                    
    disconnectConnection: restCall('DELETE', '/controller/nb/v2/connectionmanager/node/:nodeType:/:nodeId:'),
        
    addMgmtConnectionWithKnownNodeType: restCall('PUT', '/controller/nb/v2/connectionmanager/node/:nodeType:/:nodeId:/address/:ipAddress:/port/:port:'),
    
    getNodeCluster: restCall('GET', '/controller/nb/v2/connectionmanager/nodes'),
    
    
    //Bridge API   
    createBridge: restCall('POST', '/controller/nb/v2/networkconfig/bridgedomain/bridge/:nodeType:/:nodeId:/:bridgeName:'), 
                    
    deleteBridge: restCall('DELETE', '/controller/nb/v2/networkconfig/bridgedomain/bridge/:nodeType:/:nodeId:/:bridgeName:'), 
                    
    addPortToBridge: restCall('POST', '/controller/nb/v2/networkconfig/bridgedomain/port/:nodeType:/:nodeId:/:bridgeName:/:portName:'), 
                    
    deletePortFromBridge: restCall('DELETE', '/controller/nb/v2/networkconfig/bridgedomain/port/:nodeType:/:nodeId:/:bridgeName:/:portName:'), 
                    
    addPortAndVlanToBridge: restCall('POST', '/controller/nb/v2/networkconfig/bridgedomain/port/:nodeType:/:nodeId:/:bridgeName:/:portName:/:vlan:'), 
    
    //Left to add: 
    //Neutron: https://jenkins.opendaylight.org/controller/job/controller-merge/lastSuccessfulBuild/artifact/opendaylight/northbound/networkconfiguration/neutron/target/site/wsdocs/index.html
	// etc.

        normalize: function (obj) {
                var normalizedField;
                var normalizedObj;
        if (!obj){ return 0; }
		if (obj.constructor === Array) {
			normalizedObj = [];
			for (i in obj) {
				normalizedObj.push(this.normalize(obj[i]))
			}
		} else if (obj.constructor === String || obj.constructor === Number ||  obj.constructor === Boolean || obj === 0) {
			normalizedObj = obj;
		} else {
			normalizedObj = {};
			for (fromField in TO_OFP) {
				if (obj[fromField] || obj[fromField] === 0) {
		 	        	toField = TO_OFP[fromField];
	                        	normalizedObj[toField] = this.normalize(obj[fromField]);
				}
			}
			/* NOT CURRENTLY USED - REVERTED BACK TO TO_OFP APPROACH
			for (toField in FROM_OFP) {
                	        fromField = FROM_OFP[toField];
				if (obj[fromField]) {
	                        	normalizedObj[toField] = this.normalize(obj[fromField]);
				}
			}*/
                }
                //parse out unnessecary fields? Make all hostConfig, flowStatistic etc. equal to "Stats", then parse that in toClient.
                return normalizedObj;
        },
    
    nodeParse: function(current, obj) {
    switch(current){
              case 'topology':
                arr = [];
                newObj = {};
                for (var i=0; i<obj.edgeProperties.length; i++){
                    newObj.SourceDPID = obj.edgeProperties[i].edge.tailNodeConnector.node.id;
                    newObj.SourcePortNum = obj.edgeProperties[i].edge.tailNodeConnector.id;
                    newObj.DestionationDPID = obj.edgeProperties[i].edge.headNodeConnector.node.id;
                    newObj.DestionationPortNum = obj.edgeProperties[i].edge.headNodeConnector.id;
                    arr.push(newObj);
                }
                normalizerObj = {};
                normalizerObj.Stats = arr;
                return normalizerObj;
                break;
            default:
                return obj;
      }  
    },
    
}

