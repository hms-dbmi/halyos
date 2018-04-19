import 'whatwg-fetch';

export function getNext (bundle, process, fhirAPI) {
    var i;
    var d = bundle.data.entry || [];
    var entries = [];
    for (i = 0; i < d.length; i++) {
        entries.push(d[i].resource);
    }
    process(entries);

    fhirAPI.nextPage({bundle:bundle.data}).then(function (r) {
        getNext(r, process).then(function (t) {
            def.resolve();
        });
    }, function(err) {def.resolve()});
    return def.promise;
}

export function drain (url, process, done, fhirAPI) {
    var ret = adapter.defer();
    
    fetch(url)
      .then(function(data){
        getNext(data, process, fhirAPI).then(function() {
            done();
      });
    });
};

var defer = function(){
    pr = jquery.Deferred();
    pr.promise = pr.promise();
    return pr;
};


export function fetchAll(url, fhirAPI) {
    var results = [];
    var ret = defer;
    drain(
        url,
        function(entries) {
            entries.forEach(function(entry) {
                results.push(entry);
            });
        },
        function () {
            ret.resolve(results);
        },
        fhirAPI
    );
      
    return ret.promise;
};


