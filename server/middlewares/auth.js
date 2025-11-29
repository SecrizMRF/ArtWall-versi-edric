export const protect = async (req, res, next) => {
    try {
        console.log('🔐 Auth middleware - Headers:', req.headers);
        console.log('🔐 Auth middleware - Cookies:', req.headers.cookie);
        console.log('🔐 Auth middleware - Authorization:', req.headers.authorization);
        
        // Try Clerk middleware first (for cookies)
        const auth = req.auth();
        console.log('🔐 Auth middleware - Clerk auth result:', auth);
        
        if (auth && auth.userId) {
            console.log('🔐 Auth middleware - User authenticated via cookies:', auth.userId);
            req.authUserId = auth.userId;
            next();
            return;
        }
        
        // Try JWT token from Authorization header
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            console.log('🔐 Auth middleware - Found JWT token:', token.substring(0, 20) + '...');
            
            try {
                // Verify JWT token with Clerk
                const { clerkClient } = await import('@clerk/clerk-sdk-node');
                const verifiedToken = await clerkClient.verifyToken(token);
                
                if (verifiedToken && verifiedToken.sub) {
                    console.log('🔐 Auth middleware - User authenticated via JWT:', verifiedToken.sub);
                    req.authUserId = verifiedToken.sub;
                    next();
                    return;
                }
            } catch (jwtError) {
                console.log('🔐 Auth middleware - JWT verification failed:', jwtError.message);
            }
        }
        
        console.log('🔐 Auth middleware - No auth found, returning 401');
        return res.status(401).json({ 
            success: false, 
            message: 'User not authenticated' 
        });
        
    } catch (error) {
        console.error('🔐 Auth middleware error:', error);
        res.status(401).json({ 
            success: false, 
            message: 'Authentication failed: ' + error.message 
        });
    }
};