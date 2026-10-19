//Bir sonraki adıma geçileceğinin garantisini veren middleware fonksiyonu. 

module.exports = (req, res, next) => {
  const timestamp = new Date().toISOString(); //toLocaletimeString() yerine toISOString() kullanıldı, çünkü toLocaletimeString() farklı tarayıcılarda farklı formatlarda dönebilir. Bu nedenle, logların daha tutarlı olması için toISOString() kullanıldı.
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
};
