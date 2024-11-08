import { selectAllTasks } from "../models/Task.js"
import { emptyOrRows } from "../helpers/utils.js"
import { insertTask } from "../models/Task.js"
import { ApiError } from "../helpers/ApiError.js"
import { pool } from "../helpers/db.js"

const getTasks = async (req, res, next) => {
    try {
        const result = await selectAllTasks()
        return res.status(200).json(emptyOrRows(result))
    } catch(error) {
        return next(error)
    }
}

const postTask = async(req, res, next) => {
    try {
        if (!req.body.description || req.body.description.length === 0) {
            const error = new ApiError('Invalid description for task', 400)
            error.statusCode = 400
            return next(error)
        }
        const result = await insertTask(req.body.description)
        return res.status(200).json({id: result.rows[0].id})
    } catch(error) {
  
        return next(error)
    }
}

const deleteTask = async(req, res, next) => {
    const id = parseInt(req.params.id)
    pool.query('delete from task where id = $1',
        [id],
        (error,result) => {
            if(error) {
                return next(error)
            }
            return res.status(200).json({id: id})
        }
    )
}

export { getTasks, postTask, deleteTask }