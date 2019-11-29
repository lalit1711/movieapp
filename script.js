$(document).ready(function(){
    //$('[data-toggle="tooltip"]').tooltip();
    callAllData();
})
var start = 0;
var end = 10;
var all_movies=[]
var movies = []
function callAllData(){
    $.ajax({
        url : 'wine.json',
        success: function(data) {
            all_movies = data;
            //console.log(data);
            movies = data;
            var sumOfPopularity = 0
            document.getElementById("winecard").innerHTML = "";
            setAllMovies(data, start, end);
            setCountry();
            setLanguage();
            for (i = 0; i < data.length; i++) {
                availableTags.push(data[i].movie_title)
                sumOfPopularity += data[i].rating;
            }
            console.log(sumOfPopularity);
        }
    });
}

var nm = []
var image = ""
function setAllMovies(data,start,end){
    nm = data;
    if(data.length<end){
        end = data.length;
    }

    var name="";
    for(i=start;i<end;i++){
        name = data[i].movie_title;
        deg = data[i].genres;
        if(data[i].movie_title.length>20){
            name = getShorterName(data[i].movie_title)
        }
        getPoster(data[i].movie_title,i);
                $('#winecard').append(
                    '<div class="col-sm-4" style="margin-top:1%;" id='+data[i].movie_imdb_link+'>'+
                    '<div class="card" onclick="showDesp('+i+')">'+
                    '<img id='+i.toString()+' alt="John" style="width:100%;height:350px;">'+
                    '<p class="title"><span class="fa fa-heart" style="color:red;"></span> <font id='+i.toString().concat("rate")+'>'+data[i].rating+'</font>%  &nbsp<font>'+name+'</font></p>'+
                    '<br/><br/><br/>'+
                    '<div style="display: inline-block;">'+
                    '<p style="font-size:12px;    color: #999;font-family: Roboto,sans-serif;">'+makeSpace(deg)+'</p>'+
                    '</div>'+
                    '<br/>'+
                    '<div id='+"desp".concat(i.toString())+' style="display:none;">'+
                    '<center>' +
                    '<p>Director - '+data[i].director_name+'</p>'+
                    '<p>cast - '+data[i].actor_name+', '+data[i].actor_2_name+'</p>'+
                    '<p>Language - '+data[i].language+'</p>'+
                    '<p>Country - '+data[i].country+'</p>'+
                    '<button onclick="showMoreInfo('+i+')">More Info</button>'+
                    '</center>'+
                    '</div>'+
                    '</div>'+
                    '</div>'
                );

    }
    if(data.length<=10){
        $('#lm').hide();
    }
    else{
        $('#lm').show();
    }
}

function showMoreInfo(movie){
    localStorage.setItem("movie",JSON.stringify(nm[movie]));
    var data = JSON.parse(localStorage.getItem('movie'));
    console.log(this.id);
    window.location = 'all.html?'.concat(nm[movie].movie_title);
}

function makeSpace(ata){
    var a = ''
    var k =0;
    for(j=0;j<ata.length;j++){
        if(ata[j]=='|'){
            a+=" | "
            k++
        }
        else{
            a+=ata[j]
        }
        if(k==4){
            break;
        }
    }
    return a;
}

function getPoster(name,i){
    // $.ajax({
    //     url : "https://api.themoviedb.org/3/search/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=".concat(name.concat('"')),
    //     success: function(mdata){
    //     var image = mdata.results[0].poster_path;
    //     //console.log(image)
    // }
    $.getJSON("https://api.themoviedb.org/3/search/movie?api_key=501dca5d22aa7bc1a8e2ffd25a7ddd73&query=" + name + "&callback=?", function(json) {
        if (json != "Nothing found."){
            image = json.results[0].poster_path;
            image = "http://image.tmdb.org/t/p/w500".concat(image.concat(''));
            document.getElementById(i.toString()).src=image;
        }

});
}

function setrating(vote,k){
    all_movies[k]['rating'] = vote;
    ////console.log(all_movies[k]);
}

function showCoun(id){
    $('#'+id).slideToggle();
}

function setCountry(){
    var all_con =[];
    for(i=0;i<all_movies.length;i++){
        all_con.push(all_movies[i].country);
    }
    var unique= all_con.filter(function(itm, i){
        return all_con.indexOf(itm)== i;
        // returns true for only the first instance of itm
    });
    putCountry(unique,"country");
}
function setLanguage(){
    var all_con =[];
    for(i=0;i<all_movies.length;i++){
        all_con.push(all_movies[i].language);
    }
    var unique= all_con.filter(function(itm, i){
        return all_con.indexOf(itm)== i;
        // returns true for only the first instance of itm
    });
    putLanguage(unique,"language");
}
var uniq=[];
function putLanguage(unique,id){
    uniq = unique;
    for(i=0;i<unique.length;i++){
        name = unique[i];
       // //console.log(name);
        if(unique[i]==""){}
        else {
            $('#' + id).append(
                '<input type="checkbox" id='+i.toString().concat("l")+' onclick="filter()"style="float:left;margin-right:1%;"><p id="sds">' + unique[i] + '</p>'
            )
        }
    }
}

function putCountry(unique,id){
    uniqe = unique;
    for(i=0;i<unique.length;i++){
        name = unique[i];
        if(unique[i]==""){}
        else {
            $('#' + id).append(
                '<input type="checkbox" id='+i.toString().concat("c")+' onclick="filter()"style="float:left;margin-right:1%;"><p id="sds">' + unique[i] + '</p>'
            )
        }
    }
}
var uniqe =[];
Array.prototype.filter= Array.prototype.filter || function(fun, scope){
    var T= this, A= [], i= 0, itm, L= T.length;
    if(typeof fun== 'function'){
        while(i<L){
            if(i in T){
                itm= T[i];
                if(fun.call(scope, itm, i, T)) A[A.length]= itm;
            }
            ++i;
        }
    }
    return A;
}
Array.prototype.indexOf= Array.prototype.indexOf || function(what, i){
    if(!i || typeof i!= 'number') i= 0;
    var L= this.length;
    while(i<L){
        if(this[i]=== what) return i;
        ++i;
    }
    return -1;
}
function showDesp(a){
    a=a.toString();
    $('#desp'+a).slideToggle();
}

function hideDesp(a){
    a=a.toString();
    $('#desp'+a).hide(400);
}
function getShorterName(str){
    str = str.substring(0,20)
    return str;
}

function loadMore(){
    //console.log(start);
    if(start<all_movies.length){
        start=start+10;
        end=start+10;
        //console.log(start);
    }
    if(start>40){
        location.index = 'all.html';
    }
    setAllMovies(all_movies,start,end)
}

function filter(){
    movies = [];
    var key =[];
    for(i=0;i<uniqe.length;i++){
        var id = i.toString().concat("c");
        ////console.log(id);
        if(i==2){

        }
        else {
            if (document.getElementById(id).checked) {
                key.push(uniqe[i])
            }
        }
    }
    //console.log(key);
    for(j=0;j<key.length;j++){
        for(i=0;i<all_movies.length;i++){
            if(key[j] == all_movies[i].country){
                movies.push(all_movies[i]);
            }
        }
    }
    if(movies.length==0){
        movies = all_movies;
    }
    document.getElementById("winecard").innerHTML = '';
    filter1();
}

function filter1(){
    //console.log(movies)
    var movies1=[]
    var key =[];
    for(i=0;i<uniq.length;i++){
        var id = i.toString().concat("l");
        ////console.log(id);
        if(i==1){

        }
        else {
            if (document.getElementById(id).checked) {
                key.push(uniq[i])
            }
        }
    }
    //console.log(key);
    for(j=0;j<key.length;j++){
        for(i=0;i<movies.length;i++){
            if(key[j] == movies[i].language){
                movies1.push(movies[i]);
                //console.log(movies[i]);
            }
        }
    }
    if(movies1.length==0 && key.length==0){
        if(movies.length==0){
            movies1=all_movies;
        }
        else{
            movies1=movies;
        }
    }
    //console.log(movies1);
    document.getElementById("winecard").innerHTML = '';
    setAllMovies(movies1,0,10);
}

function sortArray(key){
    var data = all_movies;
    var a = [];
    var b = [];
    for(i=0;i<data.length;i++){
        a[i] = data[i][key]
    }
    a = a.sort();

    for(i=0;i<a.length;i++){
        for(j=0;j<data.length;j++){
            var flag = 0
            if(data[j][key]==a[i]){
                for(k=0;k<b.length;k++){
                    if(b[k].movie_imdb_link==data[j].movie_imdb_link){
                        flag++;
                    }
                }
                if(!flag){
                    b.push(data[j]);
                }
            }
        }
    }
    //console.log(b);
    if(key=="rating" || key == "title_year"){
        b = b.reverse();
    }
    all_movies = b;
    document.getElementById("winecard").innerHTML = '';
    setAllMovies(b,0,10);
}

function sel(){
    var key = $('#sort').val();
    if(key!='Sort By'){
        sortArray(key);
    }
}

function showSearch(){
    var key = document.getElementById("searchkey").value.toString();
    key = key.toUpperCase();
    var mo = []
    var a = '';
    for(i=0;i<all_movies.length;i++){
        a=(all_movies[i].movie_title).toString().toUpperCase();
        if(a.indexOf(key)!=-1){
            mo.push(all_movies[i])
        }

    }
    document.getElementById("winecard").innerHTML = '';
    setAllMovies(mo,0,10);
}
var availableTags = []

    $( "#searchkey" ).autocomplete({
        source: availableTags
    });

function updateJSONFile(){
    // $.getJSON( "wine.json", function( data ) {
    //     // now data is JSON converted to an object / array for you to use.
    //     console.log(data) // Tim Robbins, Morgan Freeman, Bob Gunton
      
    //     var newMovie = {cast:'Jack Nicholson', director: 'asa'} // a new movie object
      
    //     // add a new movie to the set
    //     data.push(newMovie);  
    //     console.log(data);    
    //   });
    var xhr = new XMLHttpRequest(),
    jsonArr,
    method = "GET",
    jsonRequestURL = "wine.json";

xhr.open(method, jsonRequestURL, true);
xhr.onreadystatechange = function()
{
    if(xhr.readyState == 4 && xhr.status == 200)
    {
        // we convert your JSON into JavaScript object
        jsonArr = JSON.parse(xhr.responseText);

        // we add new value:
        jsonArr.push({"nissan": "sentra", "color": "green"});

        // we send with new request the updated JSON file to the server:
        xhr.open("POST", jsonRequestURL, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        // if you want to handle the POST response write (in this case you do not need it):
        // xhr.onreadystatechange = function(){ /* handle POST response */ };
        xhr.send("jsonTxt="+JSON.stringify(jsonArr));
        // but on this place you have to have a server for write updated JSON to the file
    }
};
xhr.send(null);
}

var data = '<div class="col s12 m6">\n' +
    '          <div class="card blue-grey darken-1">\n' +
    '            <div class="card-content white-text">\n' +
    '              <span class="card-title"> 1. Wii Sports</span>\n' +
    '              <p>\n' +
    '                <table class="highlight">\n' +
    '                  <tbody>\n' +
    '                    <tr>\n' +
    '                      <td>Platform</td>\n' +
    '                      <td>Wii</td>\n' +
    '                    </tr>\n' +
    '                    <tr>\n' +
    '                      <td>Year</td>\n' +
    '                      <td>2006</td>\n' +
    '                    </tr>\n' +
    '                    <tr>\n' +
    '                      <td>Genre</td>\n' +
    '                      <td>Sports</td>\n' +
    '                    </tr>\n' +
    '                    <tr>\n' +
    '                      <td>Publisher</td>\n' +
    '                      <td>Nintendo</td>\n' +
    '                    </tr>\n' +
    '                    <tr>\n' +
    '                      <td>Global_Sales</td>\n' +
    '                      <td>82.74 </td>\n' +
    '                    </tr>\n' +
    '                  </tbody>\n' +
    '                </table>\n' +
    '              </p>\n' +
    '            </div>\n' +
    '            <div class="card-action">\n' +
    '              <a href="#">more</a>\n' +
    '            </div>\n' +
    '          </div>\n' +
    '        </div>'
