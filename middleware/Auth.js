export default function(req, res, next) {
    if (req.session.user) {
        console.log("User in session:", req.session.user); 
        req.user = req.session.user;
        next();
    } else {
        res.redirect("/login");
    }
}