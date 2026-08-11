/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User Profile management
 */

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Profile]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Profile data
 *   put:
 *     summary: Update current user's profile
 *     tags: [Profile]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               headline:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated profile data
 */

/**
 * @swagger
 * /profile/avatar:
 *   post:
 *     summary: Upload avatar image
 *     tags: [Profile]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 */
