window.onload=async function () {

    var dt=await axios.get("/itemCard");
    Vue.component('itemcart', {
        props:{
            item:Object
        },
        data: function () {
            return {
                count: 0,
                newListElem:"",
            }
        },
        methods:{
            addItem:async function (parent) {
                console.log("addItem", this.item.parent)
                var dt=await axios.put("/rest/api/itemsAdd/"+this.item.parent);
                this.$emit('additem', dt.data)
            },
            deleteBlock:async function(item){
                var dt=await axios.delete("/rest/api/items/"+item.id);
                this.$emit('deleteitem', item.id)
            },
            ondeleteitem:function(id){
                this.item.child=this.item.child.filter(c=>c.id!=id);
            },
            addChild:async function (item) {
                var dt=await axios.put("/rest/api/items/"+ item.id);
                this.item.child.push(dt.data)
                //this.$emit('addchild', dt.data)
                //
            },
            onnadditem:async function(data){
               // this.$emit('addchild', data)

                this.item.child.push(data)
            },
            changeItem:async function () {
                console.log("changeItem")
                var dt=await axios.post("/rest/api/items/" , {item:this.item});
            },
            AddNewListElem:async function(){

                this.item.list.push({id:moment().unix(), title:this.newListElem, isActive:false});
                console.log("AddNewListElem", this.item.list)
                this.newListElem="";
                await this.changeItem();
            },
            delListElem:async function(el){
                this.item.list=this.item.list.filter(e=>e.id!=el.id);
                await this.changeItem();
            }
            ,
            editListElem:async function(el){
                await this.changeItem();
            }
        },
        template: dt.data
    })

 var app=new Vue({
     el:"#app",
     data:{
         items:[],
         opacity:false,
     },
     methods:{
         addItem:async function (parent) {
             var dt=await axios.put("/rest/api/items",{parent:parent});
             this.items.push(dt.data);
         },
         onaddchild:function (item) {
             this.items.forEach(it=>{
                 if(it.id==item.parent) {
                     console.log(it)
                     it.child.push(item)
                 }
             })
             
         },
         onnadditem:function (item) {
             this.items.push(item);
         },
         ondeleteitem:function (id) {
             console.log("ondeleteitem", id,this.items )
             this.items=this.items.filter(c=>c.id!=id);
             console.log("ondeleteitem2", id,this.items )
         },
     },
     mounted:async function () {
         var dt=await axios.get("/rest/api/anketaAitems");
         for(var item of dt.data){
             item.child=await getChildElems(item.id);
         }
         this.items=dt.data;
         this.opacity=true;
       // var dt=await axios.get("/rest/api/items");
      //  this.items=dt.data;

     }
 });
}
async function getChildElems(id) {
    var dt=await axios.get("/rest/api/anketaAitems/"+id);
    for(var item of dt.data){
        item.child=await getChildElems(item.id);
    }
    return dt.data;
}