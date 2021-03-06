//Much of this code is from: http://stackoverflow.com/questions/21085624/how-to-create-a-normal-sails-model-without-being-in-the-models-folder

// E.g. in /api/hooks/plugins/index.js
/*
 * Module dependencies
 */

var Waterline = require('waterline');

module.exports = function(sails) {
    return function(cb) {
     var Floodlight = require('../../adapters/FloodlightAdapter');  
              
       var Opendaylight = require('../../adapters/OpenDaylightAdapter');
           
        sails.after('hook:orm:loaded', function() {
          pluginLoader(function(err, plugins) {
            //plugins = [RolePlugin];  

            var fs = require('fs');
              
            var path = require('path');  

              
            fs.readdir('./api/hooks/plugins/zipped', function(err, files){
                for (var k=0; k<files.length; k++){
                    var file = files[k];
                    var zipIndex = file.search(/.zip$/);
                    if(zipIndex !== -1){
                        zip = file;
                        //var zipName = path.basename(zip);
                        fs.renameSync('./api/hooks/plugins/zipped/' + zip, './api/hooks/plugins/files/' + zip);
                        fs.appendFileSync('./api/hooks/plugins/names.txt', '' + './api/hooks/plugins/files/' + zip + '' + '\n', {encoding: 'utf-8'});
                        var unzipped =  zip.substr(0, zip.length - 4);
                        //var unzippedName = path.basename(unzipped);
                        fs.appendFileSync('./api/hooks/plugins/names.txt', '' + './api/hooks/plugins/files/' + unzipped + '' + '\n', {encoding: 'utf-8'});
                    }
                }
            });
              
            
            //var plugins = fs.readdirSync('./api/hooks/plugins/models');
              
            var recursive = require('recursive-readdir');
              
            sails.config.pluggedInFileNames = [];
              
            recursive('./api/hooks/plugins/files', function (err, files) {
              // Files is an array of filename    
                
            arr = [];
                
            for(var g=0; g<files.length; g++){
                    var file = files[g];
                   
                    var modindex = file.search(/Model.js$/); //change to identify files in the Model folder
                    if(modindex !== -1){
                        var model = files[g].substr(23, files[g].length);
                        //console.log(model);
                        
                        var ModelName = path.basename(model);
                        fs.renameSync('./api/hooks/plugins/files/' + model, './api/models/' + ModelName);
                        fs.appendFileSync('./api/hooks/plugins/names.txt', '' + './api/models/' + ModelName + '' + '\n', {encoding: 'utf-8'});
                        var model = '.' + model;
                        mod = require(model);
                        var id = mod.identity;
                        sails.models[id] = mod;
                        //console.log(sails.models);
                        obj = {};
                        obj.models = mod;
                        obj.controllers = {};
                        obj.adapters = {};
                        arr.push(obj);
                    }
                    var ctlrindex = file.search(/Controller.js$/);
                    if(ctlrindex !== -1){
                        var controller = files[g].substr(23, files[g].length);
                        //console.log(controller);
                        
                        var ControllerName = path.basename(controller);
                        fs.renameSync('./api/hooks/plugins/files/' + controller, './api/controllers/' + ControllerName);
                        fs.appendFileSync('./api/hooks/plugins/names.txt', '' + './api/controllers/' + ControllerName + '' + '\n', {encoding: 'utf-8'});
                        var controller = '.' + controller;
                        ctr = require(controller);
                        var id = ctr.identity;
                        sails.controllers[id] = ctr;
                        //console.log(sails.controllers);
                        obj = {};
                        obj.controllers = ctr;
                        obj.models = {}; //all objects must have a controllers prop and a models prop
                        obj.adapters = {};
                        arr.push(obj);
                    }
                   
            }

                
            cb();

            });
              
          });
            
        });
    }
}
    

    
    
/*function injectPluginModels(pluginModels, cb) {
  // copy sails/lib/hooks/orm/loadUserModules to make it accessible here
    
  var loadUserModelsAndAdapters = require('./loadUserModules')(sails);
     
  async.auto({
    // 1. load api/models, api/adapters
    _loadModules: loadUserModelsAndAdapters,

    // 2. Merge additional models,  3. normalize model definitions
    modelDefs: ['_loadModules', function(next){
      _.each(pluginModels, function(pluginModel) {
         _.merge(sails.models, pluginModel);
      });

      _.each(sails.models, sails.hooks.orm.normalizeModelDef);
      next(null, sails.models);
    }],

    // 4. Load models into waterline, 5. tear down connections, 6. reinitialize waterline
    instantiatedCollections: ['modelDefs', function(next, stack){
      var modelDefs = stack.modelDefs;

      var waterline = new Waterline();
      _.each(modelDefs, function(modelDef, modelID){
        waterline.loadCollection(Waterline.Collection.extend(modelDef));
      });

      var connections = {};

      _.each(sails.adapters, function(adapter, adapterKey) {
        _.each(sails.config.connections, function(connection, connectionKey) {
          if (adapterKey !== connection.adapter) return;
          connections[connectionKey] = connection;
        });
      });

      var toTearDown = [];

      _.each(connections, function(connection, connectionKey) {
        toTearDown.push({ adapter: connection.adapter, connection: connectionKey });
      });

      async.each(toTearDown, function(tear, callback) {
         sails.adapters[tear.adapter].teardown(tear.connection, callback);
      }, function(){
         waterline.initialize({
           adapters: sails.adapters,
           connections: connections
         }, next)
      });
    }],
 
      
    // 7. Expose initialized models to global scope and sails
    _prepareModels: ['instantiatedCollections', sails.hooks.orm.prepareModels]

  }, cb);
};
    
    
  // injectPluginModels and mountBlueprintsForModels defined here
  function mountBlueprintsForModels(pluginModels, pluginControllers) {
  _.each(pluginModels, function(pluginModel){
 
              var controller = _.cloneDeep(pluginModel);
                controller._config = { actions: true, rest: true, shortcuts: true };

                controller.index = function (req, res) {
                    return res.send("To be completed...");
                };

                controllerId = pluginModel.identity;
              
           
               if (!_.isObject(sails.controllers[controllerId])) {
                  sails.controllers[controllerId] = controller;
                }

                if (!_.isObject(sails.hooks.controllers.middleware[controllerId])) {
                  sails.hooks.controllers.middleware[controllerId] = controller;
                }
    });
}

    function pluginLoader(cb){
        //filesystem iterator
        cb();
    }

  return {
      

    initialize: function(cb) {
       var Floodlight = require('../../adapters/FloodlightAdapter');  
              
       var Opendaylight = require('../../adapters/OpenDaylightAdapter');
           
        sails.after('hook:orm:loaded', function() {
          pluginLoader(function(err, plugins) {
            //plugins = [RolePlugin];  

            var fs = require('fs');
              
            var path = require('path');  

              
            fs.readdir('./api/hooks/plugins/zipped', function(err, files){
                for (var k=0; k<files.length; k++){
                    var file = files[k];
                    var zipIndex = file.search(/.zip$/);
                    if(zipIndex !== -1){
                        zip = file;
                        //var zipName = path.basename(zip);
                        fs.renameSync('./api/hooks/plugins/zipped/' + zip, './api/hooks/plugins/files/' + zip);
                        fs.appendFileSync('./api/hooks/plugins/names.txt', '' + './api/hooks/plugins/files/' + zip + '' + '\n', {encoding: 'utf-8'});
                        var unzipped =  zip.substr(0, zip.length - 4);
                        //var unzippedName = path.basename(unzipped);
                        fs.appendFileSync('./api/hooks/plugins/names.txt', '' + './api/hooks/plugins/files/' + unzipped + '' + '\n', {encoding: 'utf-8'});
                    }
                }
            });
              
            
            //var plugins = fs.readdirSync('./api/hooks/plugins/models');
              
            var recursive = require('recursive-readdir');
              
            sails.config.pluggedInFileNames = [];
              
            recursive('./api/hooks/plugins/files', function (err, files) {
              // Files is an array of filename    
                
            arr = [];
                
            for(var g=0; g<files.length; g++){
                    var file = files[g];
                   
                    var modindex = file.search(/Model.js$/); //change to identify files in the Model folder
                    if(modindex !== -1){
                        var model = files[g].substr(23, files[g].length);
                        //console.log(model);
                        
                        var ModelName = path.basename(model);
                        fs.renameSync('./api/hooks/plugins/files/' + model, './api/models/' + ModelName);
                        fs.appendFileSync('./api/hooks/plugins/names.txt', '' + './api/models/' + ModelName + '' + '\n', {encoding: 'utf-8'});
                        /*var model = '.' + model;
                        mod = require(model);
                        var id = mod.identity;
                        sails.models[id] = mod;
                        //console.log(sails.models);
                        obj = {};
                        obj.models = mod;
                        obj.controllers = {};
                        obj.adapters = {};
                        arr.push(obj);
                    }
                    var ctlrindex = file.search(/Controller.js$/);
                    if(ctlrindex !== -1){
                        var controller = files[g].substr(23, files[g].length);
                        //console.log(controller);
                        
                        var ControllerName = path.basename(controller);
                        fs.renameSync('./api/hooks/plugins/files/' + controller, './api/controllers/' + ControllerName);
                        fs.appendFileSync('./api/hooks/plugins/names.txt', '' + './api/controllers/' + ControllerName + '' + '\n', {encoding: 'utf-8'});
                        /*var controller = '.' + controller;
                        ctr = require(controller);
                        var id = ctr.identity;
                        sails.controllers[id] = ctr;
                        //console.log(sails.controllers);
                        obj = {};
                        obj.controllers = ctr;
                        obj.models = {}; //all objects must have a controllers prop and a models prop
                        obj.adapters = {};
                        arr.push(obj);
                    }
                   
            }

            plugins = arr;
             
          // assuming plugin.models holds array of models for this plugin
          // customize for your use case
          var pluginModels = _.pluck(plugins, 'models');
          var pluginControllers = _.pluck(plugins, 'controllers');
          //var pluginAdapters = _.pluck(plugins, 'adapters');
          injectPluginModels(pluginModels, cb);
          mountBlueprintsForModels(pluginModels, pluginControllers);
                
                
            });
              
          /*var pluginModels = _.pluck(plugins, 'models');
          var pluginControllers = _.pluck(plugins, 'controllers');
          //var pluginAdapters = _.pluck(plugins, 'adapters');
          injectPluginModels(pluginModels, cb);
          mountBlueprintsForModels(pluginModels, pluginControllers);       

    });

    });

      
    }
  }*/
  
