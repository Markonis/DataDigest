function ChartFactory(){
    this.create = function(element, containerId){
        try{
            
            var chart;
            
            if(!element.hasOwnProperty("type")) throw "Chart type not specified.";
            if(!element.hasOwnProperty("data") || element.data == null || element.data == "" || (element.data.constructor === Array && element.data.length == 0)) throw "Chart data not specified.";
            
            switch(element.type){
                case "pie": chart = new PieChart(element, containerId); break;
                case "series": chart = new SeriesChart(element, containerId); break;
                case "seriesDate": chart = new SeriesDateChart(element, containerId); break;
                case "pack": chart = new CirclePackChart(element, containerId); break;
//                case "bar": chart = new BarChart(element, containerId); break;
            }
            
            return chart;
            
        }catch(error){
            
            document.querySelector("#" + containerId).innerHTML = "An error occurred: <br>" + error;
            return new DefaultChart();
        }
    }   
}

function DefaultChart(){
    this.draw = function(){};
}

var cf = new ChartFactory();