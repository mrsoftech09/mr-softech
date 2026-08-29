export function requireApiKey(req,res,next){
  const expected=process.env.API_KEY;
  const provided=req.get('x-api-key');
  if(!expected||provided!==expected)return res.status(401).json({error:'Unauthorized'});
  next();
}
