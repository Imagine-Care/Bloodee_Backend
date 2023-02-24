const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn'],
})

exports.getTodayQuota = async (req, res) => {
    const user = await prisma.user.findFirst({
        where: {
            id: req.id
        }
    })
    if (!user) {
        res.status(400).send({
            status: false,
            message: "User not found"
        })
    }
    // check user.daily_date  is today or not
    // use only date dont include time 
    // check condition



    if (new Date(user.daily_date).toDateString() == new Date().toDateString()) {
        res.send({
            status: true,
            message: "Daily Quota already taken",
            user: user
        })


    } else {
        // Create Or Generate 
        const cheat_select = await prisma.cheat_coupon.findMany({
            where: {
                // pt_cost <= user.cheat_point
                pt_cost: {
                    lte: user.cheat_point
                },
                // user_id: NULL check is null
                user_id: null
            }
        })
        const cheat_select_random = cheat_select[Math.floor(Math.random() * cheat_select.length)]

        const healthy_select = await prisma.healthy_coupon.findMany({
            where: {
                // pt_cost <= user.healthy_point
                pt_cost: {
                    lte: user.healthy_point
                },
                user_id: null
            }
        })
        const healthy_select_random = healthy_select[Math.floor(Math.random() * healthy_select.length)]

        const update = await prisma.user.updateMany({
            where: {
                id: req.id
            },
            data: {
                daily_date: new Date(),
                daily_cheat: cheat_select_random.id,
                daily_food: healthy_select_random.id,
                daily_select: null,
            }
        })
        const updated = await prisma.user.findFirst({
            where: {
                id: req.id
            }
        })
        res.status(200).send({
            status: true,
            message: "Daily Quota created successfully",
            user: updated
        })
    }
}

exports.getUserData = async (req, res) => {
    const user = await prisma.user.findFirst({
        where: {
            id: req.id
        }
    })
    if (!user) {
        res.status(400).send({
            status: false,
            message: "User not found"
        })
    }
    res.send({
        status: true,
        message: "User data",
        user: user
    })
}

exports.updateUser = async (req, res) => {
    const user = await prisma.user.updateMany({
        where: {
            id: req.id
        },
        data: {
            email: req.body.email,
            prefix: req.body.prefix,
            firstname: req.body.firstname,
            surname: req.body.surname
        }
    })
    if (!user) {
        res.status(400).send({
            status: false,
            message: "User not found"
        })
    }
    res.send({
        status: true,
        message: "User data updated",
        user: user
    })
    
}

exports.getCheatData = async (req, res) => {
    const cheat = await prisma.cheat_coupon.findFirst({
        where: {
            id: parseInt(req.params.id)
        }
    })
    if (!cheat) {
        res.status(400).send({
            status: false,
            message: "User not found"
        })
    }
    res.send({
        status: true,
        message: "User data",
        cheat: cheat
    })
}

exports.getFoodData = async (req, res) => {
    const food = await prisma.healthy_coupon.findFirst({
        where: {
            id: parseInt(req.params.id)
        }
    })
    if (!food) {
        res.status(400).send({
            status: false,
            message: "Food not found"
        })
    }
    res.send({
        status: true,
        message: "Food data",
        food: food
    })
}

exports.updateDailySelect = async (req, res) => {
    // if select left 
    const update = await prisma.user.updateMany({
        where: {
            id: req.id
        },
        data: {
            daily_select: req.body.daily_select,
        }
    })
    if (req.body.daily_select == 1) {
        await prisma.cheat_coupon.updateMany({
            where: {
                id: req.body.daily_cheat
            },
            data: {
                // status: 1,
                user_id: req.id,
                redeem_date: new Date(),
            }
        })
    } else {
        await prisma.healthy_coupon.updateMany({
            where: {
                id: req.body.daily_food
            },
            data: {
                // status: 1,
                user_id: req.id,
                redeem_date: new Date(),
            }
        })
    }
    res.status(200).send({
        status: true,
        message: "Daily Select updated successfully",
    })
}

exports.getSelectedCoupon = async (req, res) => {
    const user = await prisma.user.findFirst({
        where: {
            id: req.id
        }
    })
    if (!user) {
        res.status(400).send({
            status: false,
            message: "User not found"
        })
    }
    if (user.daily_select == 1) {
        const cheat = await prisma.cheat_coupon.findFirst({
            where: {
                id: user.daily_cheat
            }
        })
        res.send({
            status: true,
            message: "User data",
            coupon: cheat
        })
    } else {
        const food = await prisma.healthy_coupon.findFirst({
            where: {
                id: user.daily_food
            }
        })
        res.send({
            status: true,
            message: "User data",
            coupon: food
        })
    }
}