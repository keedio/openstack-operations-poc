/**
 * Created by davidsantamaria on 20/2/17.
 */
var charts = [];
var activeDivs = undefined;

function parseNodes(data){
    var regions = [];
    var sortedKeys = Object.keys(data[0].result).sort();
    for (var i = 0; i < sortedKeys.length; i++){
        var key = sortedKeys[i];
        var name = key.split(".");
        var value = data[0].result[key];

        if (i % 3 == 0)
            regions.push ({"name":name[0], "info":0, "warning":0, "error":0}) ;

        name[1] == "ERROR" ? regions[regions.length-1].error = value : name[1] == "INFO" ? regions[regions.length-1].info = value : regions[regions.length-1].warning = value;
    }

    return regions;
}
function parseNodesByAz(data){
    var azones = [];
    var sortedKeys = Object.keys(data[0].result).sort();
    var regionName= "", azName = "";
    for (var i = 0; i < sortedKeys.length; i++){
        var key = sortedKeys[i];
        var name = key.split(".");
        var value = data[0].result[key];

        if (name[0] != regionName){
            regionName = name[0];
            azones.push ({"name":name[0], "regions":[] }) ;
        }

        if (name[1] != azName){
            azName = name[1];
            azones[azones.length-1].regions.push ({"name":name[1], "info":0, "warning":0, "error":0}) ;
        }

        name[2] == "ERROR" ? azones[azones.length-1].regions[azones[azones.length-1].regions.length-1].error = value : name[2] == "INFO" ? azones[azones.length-1].regions[azones[azones.length-1].regions.length-1].info = value : azones[azones.length-1].regions[azones[azones.length-1].regions.length-1].warning = value;
    }

    return azones;
}
function parseServices (data){
    var services = [];
    var sortedKeys = Object.keys(data[0].result).sort();
    var serviceName= "", regionName = "";
    for (var i = 0; i < sortedKeys.length; i++){
        var key = sortedKeys[i];
        var name = key.split(".");
        var value = data[0].result[key];

        if (name[0] != serviceName){
            serviceName = name[0];
            regionName = name[1];
            services.push ({"name":name[0], "regions":[] }) ;
            services[services.length-1].regions.push ({"name":name[1], "info":0, "warning":0, "error":0}) ;
        }

        else if (name[1] != regionName){
            regionName = name[1];
            services[services.length-1].regions.push ({"name":name[1], "info":0, "warning":0, "error":0}) ;
        }

        name[2] == "ERROR" ? services[services.length-1].regions[services[services.length-1].regions.length-1].error = value : name[2] == "INFO" ? services[services.length-1].regions[services[services.length-1].regions.length-1].info = value : services[services.length-1].regions[services[services.length-1].regions.length-1].warning = value;
    }

    return services;
}
function parseData(rowdata){
    var services = [];
    jQuery.each(rowdata, function (i, data) {
        var sortedKeys = Object.keys(data[0].result);
        var  serviceName = "";
        for (var i = 0; i < sortedKeys.length; i++){
            var key = sortedKeys[i];
            var name = key.split(".");
            var value = data[0].result[key];

            if (name[1] != serviceName){
                serviceName = name[1];
                services.push ({"name":name[1], "dataInf":['Info'],  "dataError":['Error'],  "dataWar":['Warning']});

            }

            name[2] == "ERROR" ? services[services.length-1].dataError.push(value) :
                name[2] == "INFO" ? services[services.length-1].dataInf.push(value):
                    services[services.length-1].dataWar.push(value);
        }

    });
    services = services.sort(function(a,b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);} );
    return services;
}
function createChart( self, during,$compile){
    $('#accordion-services').html('');
    charts = [];
    jQuery.each(self.stackedServices, function (i,service) {
        var divID = 'graph'+ service.name;
        var div = '<div class="panel panel-default">'  +
            ' <div class="panel-heading">'  +
            '<h4 class="panel-title">'  +
            '<a data-toggle="collapse"  data-parent="#accordion-markup" data-target="#'+divID+'" class="'+asignChartCollapseIconClass (divID)+'">'  +
            '' + service.name + '</a> </h4></div>'+
            ' <div id="'+divID+'" class="'+asignChartCollapseClass (divID)+'">'  +
            '<div class="panel-body">'  +
            '<div class="row row-cards-pf">'  +
            '<div class="col-xs-12 col-sm-6"> </div></div></div> </div> </div> </div>';
        var element = angular.element(div);
        $compile(element)(self);
        angular.element('#accordion-services').append(element);

        if(service.dataError.length == 1) service.dataError.push(0);
        if(service.dataWar.length == 1) service.dataWar.push(0);
        if(service.dataInf.length == 1) service.dataInf.push(0);

        var config = {};
        config.bindto = '#'+divID;
        config.data  = {
            columns: [service.dataError, service.dataWar,service.dataInf],
            groups: [['Error', 'Warning', 'Info']],
            type: 'bar',
            order: null
        };
        config.axis = {
            x: {
                categories: generateChartLabels (during)
                ,
                type: 'category',
                tick: {
                    multiline: false,
                    centered: true
                }
            }
        };
        config.size =  {
            height: 320,
            width: 500
        };
        config.color =  {
            pattern: [
                '#FC4A1A',
                '#F7B733',
                '#4ABDAC',
            ]
        };

        var chart = c3.generate(config);
        chart.flush();
        charts.push(chart);
    });
}
function generateChartLabels (during){
    var date = new Date();
    switch(during) {
        case '1h':
            return  [formatDateHour(new Date().setMinutes(new Date().getMinutes()-60)),formatDateHour(new Date().setMinutes(new Date().getMinutes()-45)),
                formatDateHour(new Date().setMinutes(new Date().getMinutes()-30)), formatDateHour(new Date().setMinutes(new Date().getMinutes()-15)),formatDateHour (date)];
        case '6h':
            return  [formatDateHour(new Date().setHours(new Date().getHours()-6)),formatDateHour(new Date().setHours(new Date().getHours()-5)),formatDateHour(new Date().setHours(new Date().getHours()-4)), formatDateHour(new Date().setHours(new Date().getHours()-3)),
                formatDateHour(new Date().setHours(new Date().getHours()-2)),formatDateHour(new Date().setHours(new Date().getHours()-1)),formatDateHour(date)];
        case '12h':
            return  [formatDateHour(new Date().setHours(new Date().getHours()-12)),formatDateHour(new Date().setHours(new Date().getHours()-11)),formatDateHour(new Date().setHours(new Date().getHours()-10)),formatDateHour(new Date().setHours(new Date().getHours()-9)),
                formatDateHour(new Date().setHours(new Date().getHours()-8)), formatDateHour(new Date().setHours(new Date().getHours()-7)),
                formatDateHour(new Date().setHours(new Date().getHours()-6)),formatDateHour(new Date().setHours(new Date().getHours()-5)),formatDateHour(new Date().setHours(new Date().getHours()-4)), formatDateHour(new Date().setHours(new Date().getHours()-3)),
                formatDateHour(new Date().setHours(new Date().getHours()-2)),formatDateHour(new Date().setHours(new Date().getHours()-1)),formatDateHour(date)];
        case '24h':
            return [formatDateDay(new Date().setHours(new Date().getHours()-24)), '' ,'','','','',formatDateHour(new Date().setHours(new Date().getHours()-18)), '' ,'','','','', formatDateHour(new Date().setHours(new Date().getHours()-12)),
                '' ,'','','','',formatDateHour(new Date().setHours(new Date().getHours()-6)), '' ,'','','','',formatDateDay(date)];
        case '1w':
            return [formatDateDay(new Date().setDate(new Date().getDate()-7)),formatDateDay(new Date().setDate(new Date().getDate()-6)),formatDateDay(new Date().setDate(new Date().getDate()-5)),
                formatDateDay(new Date().setDate(new Date().getDate()-4)), formatDateDay(new Date().setDate(new Date().getDate()-3)),
                formatDateDay(new Date().setDate(new Date().getDate()-2)),formatDateDay(new Date().setDate(new Date().getDate()-1)),formatDateDay(date)];
        case '1m':
            return [formatDateDay(new Date().setMonth(new Date().getMonth()-1)), '' ,'','','',formatDateDay(new Date().setDate(new Date().getDate()-25)),'', '' ,'','',formatDateDay(new Date().setDate(new Date().getDate()-20)),'','',
                '' ,'',formatDateDay(new Date().setDate(new Date().getDate()-15)),'','','', '' ,formatDateDay(new Date().setDate(new Date().getDate()-10)),'','','','',formatDateDay(new Date().setDate(new Date().getDate()-5)),'',
                '','','',formatDateDay(date)];

    }
}
function formatDateHour(date){
    date = new Date (date)
    var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    return  hours + ':' + minutes;
}
function formatDateDay(date){
    date = new Date (date)
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    var month =  date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth()
    return month + '/' + day;
}
function setUpCharts(services){
	
	if(services.length == 0 ){
		charts = [];
		$('#accordion-services').html('');
		return;
	}
	charts.forEach(function(chart, i) {
		
		if(services[i].dataError.length == 1) services[i].dataError.push(0);
	    if(services[i].dataWar.length == 1) services[i].dataWar.push(0);
	    if(services[i].dataInf.length == 1) services[i].dataInf.push(0);	
	    
		chart.load({
	        columns: [services[i].dataError, services[i].dataWar,services[i].dataInf]
	    });
	});
}
function setUpChartsByDuring(services, during){
	
	if(services.length == 0 ){
		charts = [];
		$('#accordion-services').html('');
		return;
	}
	
	charts.forEach(function(chart, i) {
		
		if(services[i].dataError.length == 1) services[i].dataError.push(0);
        if(services[i].dataWar.length == 1) services[i].dataWar.push(0);
        if(services[i].dataInf.length == 1) services[i].dataInf.push(0);
        
		chart.load({
	        columns: [services[i].dataError, services[i].dataWar,services[i].dataInf],
	        categories : generateChartLabels (during)
	    });
		
		
		
});
}
function asignChartCollapseClass (service){				
	return activeDivs != undefined &&  activeDivs.filter ((i,div) => div.id == service).length > 0 ? 'panel-collapse collapse in': 'panel-collapse collapse';			
}
function asignChartCollapseIconClass (service){				
	return activeDivs != undefined &&  activeDivs.filter ((i,div) => div.id == service).length > 0 ? 'ng-binding': 'collapsed';			
}
