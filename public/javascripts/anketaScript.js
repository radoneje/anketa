window.onload=async function () {

    var dt=await axios.get("/anketaCard");
    Vue.component('anketacart', {
        props:{
            item:Object
        },
        data: function () {
            return {
                count: 0,
            }
        },
        methods:{
            updateText:async function(event, item){
                console.log(event.currentTarget.value, item.id, id)
                await axios.post("/rest/api/setTextValue",{text:event.currentTarget.value, itemid:item.id, anketaid:id})
            },
            updateInt:async function(event, item){
                console.log(item.int, item.id, id)
                await axios.post("/rest/api/setIntValue",{int:item.int, itemid:item.id, anketaid:id})
            },
            updateSelect:async function(event, item){
                console.log(item.json)
                //await axios.post("/rest/api/setIntValue",{int:event.currentTarget.value, itemid:item.id, anketaid:id})
            },
            updateList:async function (item,l){
                l.isActive=!l.isActive;
                await axios.post("/rest/api/setJsonValue",{json:item.list, itemid:item.id, anketaid:id})
            },
            showCalendar:function(e, item){
                flatpickr(e.target, {
                    defaultDate:item.date,
                    locale: "ru", // locale for this instance only
                    onChange: async function (selectedDates) {

                        var selected=moment(selectedDates[0])

                        item.date=selected;//new Date(moment(item.date).date(selected.date()).month(selected.month()).year(selected.year()).unix()*1000)
                        console.log(selected);
                        await axios.post("/rest/api/setDateValue",{date:selected, itemid:item.id, anketaid:id})
                        // _this.changeRoom().then(function(){});
                    }
                });
            },
            formatDate:function (dt){
                console.log("fff", dt)
                if(!dt)
                    return moment( new Date()).format('DD.MM.YYYY')
                console.log("fff 1", dt)
                return moment( dt).format('DD.MM.YYYY')

            },
            moment:moment,
            hideHelp:function (id) {
                document.getElementById('help_'+id).style.display="none";
            },
            showHelp:function (event,id) {
                console.log(event)
                var elem=document.getElementById('help_'+id);
                elem.style.display="block";
                elem.style.left=event.layerX+"px";
            }
        },
        template: dt.data
    })

 var app=new Vue({
     el:"#app",
     data:{
         template:[],
         rec:{},
         opacity:false,
     },
     methods:{

         moment:moment
     },
     mounted:async function () {
         this.rec=(await axios.get("/rest/api/anketaTitle/"+id)).data;
         var val=await axios.get("/rest/api/anketaValues/"+id);
        var dt=await axios.get("/rest/api/anketaAitems");
        dt=setData(dt, val)
        for(var item of dt.data){
            item.child=await getChildElems(item.id, val);
        }



        this.template=dt.data;
        console.log(this.template)
         this.opacity=true;
     }
 });
}
function  setData(dt, val){
    dt.data.forEach(d=>{
        d.text='';
        d.bool=false;
        d.json=[];
        d.int=0;
        d.date=new Date();
        console.log(val.data)
        val.data.forEach(v=>{
            if(v.itemid==d.id){
                d.text=v.text;
                d.bool=v.bool;
                d.json=v.json;
                d.int=v.int;
                d.date=v.date;

                if(d.list)
                    d.list.forEach(l=>{
                        if(v.json)
                            v.json.forEach(j=>{
                                if(j.id==l.id && j.isActive)
                                    l.isActive=true;
                            })
                    })
            }
        })
    })
    return dt;
}
async function getChildElems(id, val) {
    var dt=await axios.get("/rest/api/anketaAitems/"+id);
    for(var item of dt.data){
        item.child=await getChildElems(item.id);
    }
    dt=setData(dt, val)
    return dt.data;
}
