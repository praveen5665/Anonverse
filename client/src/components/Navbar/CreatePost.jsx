import React from 'react'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'

const CreatePost = () => {
  return (
    <div>
        <Button variant="ghost" className="bg-my_bg rounded-md">
        <Plus /> Create
        </Button>
    </div>
  )
}

export default CreatePost