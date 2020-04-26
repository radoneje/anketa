var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/items/:parent?', async (req, res, next)=> {
  if(req.params.parent=="undefined")
    req.params.parent=null
  var dt=await getItems(req, req.params.parent||null)
 res.json(dt)
});

async function getItems(req, parent){
  var dt=await req.knex.select("*").from("t_items").where({parent:parent, isDeleted:false}).orderBy("id");
  for(item of dt){
    item.child=[];
  }
  return dt;
}

router.put('/items/:parent?', async (req, res, next)=> {
  var data={};
  console.log("req.params.parent 22", req.params.parent)
      if(req.params.parent)
        data={parent:req.params.parent}
  var dt = await req.knex("t_items").insert(data, "*");
  dt[0].child=[];
  res.json(dt[0]);
});
router.put('/itemsAdd/:id?', async (req, res, next)=> {
  var data={};
  console.log("req.params.parent 111", req.params.id)
  if(req.params.id && req.params.id!="undefined" && req.params.id!="null") {
    console.log("req.params.parent set data", req.params.id)
    data = {parent: req.params.id}
  }

  var dt = await req.knex("t_items").insert(data, "*");
  dt[0].child=[];
  res.json(dt[0]);
});


router.delete('/items/:id', async (req, res, next)=> {
  var dt = await req.knex("t_items").update({isDeleted:true}, "*").where({id:req.params.id});
  dt[0].child=[];
  res.json(dt[0]);
});
router.post('/items', async (req, res, next)=> {
  var id=req.body.item.id;
  delete req.body.item.id;
  delete req.body.item.child;
  req.body.item.list=JSON.stringify(req.body.item.list)
  var dt = await req.knex("t_items").update(req.body.item, "*").where({id:id});
  dt[0].child=[];
  res.json(dt[0]);
})



router.get('/ankets/', async (req, res, next)=> {
  var dt=await req.knex.select("*").from("t_ankets").where({isDeleted:false}).orderBy("id");
  res.json(dt)
});
router.put('/ankets/', async (req, res, next)=> {
  var dt=await req.knex("t_ankets").insert({},"*");
  res.json(dt[0])
});
router.post('/ankets', async (req, res, next)=> {
  var id=req.body.item.id;
  delete req.body.item.id;
  var dt=await req.knex("t_ankets").update(req.body.item,"*").where({id:id});
  res.json(dt[0])
});

router.delete('/ankets/:id', async (req, res, next)=> {
  var dt=await req.knex("t_ankets").update({isDeleted:true},"*").where({id:req.params.id});
  res.json(dt[0])
});

router.get('/items/:parent?', async (req, res, next)=> {

  var dt=await getItems(req, req.params.parent||null)
  console.log("dd", dt);
  res.json(dt)
});

async function getItems(req, parent){
  var dt=await req.knex.select("*").from("t_items").where({parent:parent, isDeleted:false}).orderBy("id");
  var ret=[];
  for(item of dt){
    item.child=[];
    var dd=await req.knex.select("*").from("t_items").where({parent:item.id, isDeleted:false}).orderBy("id");
    for(d of dd){
      d.child=await getItems(req, d.id);

      item.child.push(d);
    }
    ret.push(item)
  }

  return ret;
}



router.get('/anketaAitems/:parent?', async (req, res, next)=> {
  var parent =req.params.parent||null;
  var dt=await req.knex.select("*").from("t_items").where({parent:parent, isDeleted:false}).orderBy("id");
  for(item of dt){
    item.child=[];
  }
  res.json(dt)
});

router.post('/setTextValue', async (req, res, next)=> {
  var dt=await req.knex.select("*").from("t_anketatoitem").where({anketaid:req.body.anketaid, itemid:req.body.itemid})
  if(dt.length==0)
    dt=await req.knex("t_anketatoitem").insert({anketaid:req.body.anketaid, itemid:req.body.itemid},"*")

    await req.knex("t_anketatoitem").update({text:req.body.text}).where({id:dt[0].id})
    res.json(dt[0].id)
});
router.post('/setIntValue', async (req, res, next)=> {
  var dt=await req.knex.select("*").from("t_anketatoitem").where({anketaid:req.body.anketaid, itemid:req.body.itemid})
  if(dt.length==0)
    dt=await req.knex("t_anketatoitem").insert({anketaid:req.body.anketaid, itemid:req.body.itemid},"*")

  await req.knex("t_anketatoitem").update({int:parseInt(req.body.int)}).where({id:dt[0].id})
  res.json(dt[0].id)
});

router.post('/setJsonValue', async (req, res, next)=> {
  var dt=await req.knex.select("*").from("t_anketatoitem").where({anketaid:req.body.anketaid, itemid:req.body.itemid})
  if(dt.length==0)
    dt=await req.knex("t_anketatoitem").insert({anketaid:req.body.anketaid, itemid:req.body.itemid},"*")

  await req.knex("t_anketatoitem").update({json:JSON.stringify(req.body.json)}).where({id:dt[0].id})
  res.json(dt[0].id)
});

router.post('/setDateValue', async (req, res, next)=> {
  var dt=await req.knex.select("*").from("t_anketatoitem").where({anketaid:req.body.anketaid, itemid:req.body.itemid})
  if(dt.length==0)
    dt=await req.knex("t_anketatoitem").insert({anketaid:req.body.anketaid, itemid:req.body.itemid},"*")

  await req.knex("t_anketatoitem").update({date:req.body.date}).where({id:dt[0].id})
  res.json(dt[0].id)
});

router.get('/anketaValues/:id', async (req, res, next)=> {
  var dt=await req.knex.select("*").from("t_anketatoitem").where({anketaid:req.params.id})
  res.json(dt);
})
router.get('/anketaTitle/:id', async (req, res, next)=> {
  var dt=await req.knex.select("*").from("t_ankets").where({id:req.params.id})
  res.json(dt[0]);
})







module.exports = router;
