import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import productsRouter from "./products.js";
import categoriesRouter from "./categories.js";
import brandsRouter from "./brands.js";
import blogsRouter from "./blogs.js";
import tutorialsRouter from "./tutorials.js";
import ordersRouter from "./orders.js";
import seedRouter from "./seed.js";
import authRouter from "./auth.js";
import cartRouter from "./cart.js";
import wishlistRouter from "./wishlist.js";
import usersRouter from "./users.js";
import addressesRouter from "./addresses.js";
import uploadRouter from "./upload.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/products", productsRouter);
router.use("/categories", categoriesRouter);
router.use("/brands", brandsRouter);
router.use("/blogs", blogsRouter);
router.use("/tutorials", tutorialsRouter);
router.use("/orders", ordersRouter);
router.use("/seed", seedRouter);
router.use("/auth", authRouter);
router.use("/cart", cartRouter);
router.use("/wishlist", wishlistRouter);
router.use("/users", usersRouter);
router.use("/addresses", addressesRouter);
router.use("/upload", uploadRouter);

export default router;
