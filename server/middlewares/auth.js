export const protect = async (req, res, next) => {
    try {
        console.log(' Auth middleware - Headers:', req.headers);
        console.log(' Auth middleware - Cookies:', req.headers.cookie);
        
        // Clerk middleware sudah menambahkan auth() ke request object
        const auth = req.auth();
        console.log(' Auth middleware - Auth result:', auth);
        
        if (!auth || !auth.userId) {
            console.log(' Auth middleware - No auth found, returning 401');
            return res.status(401).json({ 
                success: false, 
                message: 'User not authenticated' 
            });
        }
        
        console.log(' Auth middleware - User authenticated:', auth.userId);
        
        // Attach userId to request object for use in controllers
        req.authUserId = auth.userId;
        next();
    } catch (error) {
        console.error(' Auth middleware error:', error);
        res.status(401).json({ 
            success: false, 
            message: 'Authentication failed: ' + error.message 
        });
    }
};