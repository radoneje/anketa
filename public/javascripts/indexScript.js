window.onload=async function () {


 var app=new Vue({
     el:"#app",
     data:{
         items:[],
         opacity:false,
     },
     methods:{
         addItem:async function(){
             var dt=await axios.put("/rest/api/ankets");
             this.items.push(dt.data);
         },
         editItem:async function(item){
             var dt=await axios.post("/rest/api/ankets",{item });
         },
         deleteItem:async function(item){
             if(confirm("Вы действительно хотите удалить анкету?")) {
                 await axios.delete("/rest/api/ankets/" + item.id);
                 this.items = this.items.filter(i => i.id != item.id);
             }
         },
         goTo:function(item){
             document.location.href='/anketa/'+item.id
         },
         moment:moment
     },
     mounted:async function () {
        var dt=await axios.get("/rest/api/ankets");
        this.items=dt.data;
        this.opacity=true;
     }
 });
}