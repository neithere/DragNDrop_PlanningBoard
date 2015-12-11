#!/usr/bin/env python

from flask import Flask, Response, request, render_template

import json
import yaml


app = Flask(__name__)


DB = yaml.load("""

states:

  - name: todo
    label: To Do
  - name: progress
    label: In Progress
  - name: done
    label: Done

stories:

  story1:
    who: bicycle owner
    what: a bicycle shed
    why: the bike is safe
  story2:
    who: librarian
    what: bookshelf
    why: the books are organized

tasks:

  task0:
    story: story1
    state: todo
    summary: measure bike dimensions
  task1:
    story: story1
    state: todo
    summary: buy materials
  task2:
    story: story1
    state: todo
    summary: procure tools
  task3:
    story: story1
    state: todo
    summary: draw a plan
  task4:
    story: story1
    state: todo
    summary: assemble the shed
  task5:
    story: story1
    state: todo
    summary: put the bike inside
  task6:
    story: story2
    state: todo
    summary: buy the shelf in IKEA
  task7:
    story: story2
    state: todo
    summary: mount the shelf onto the wall

""")


@app.route('/')
def index():
    return render_template('base.html')


@app.route('/data_as_is')
def data_as_is():
    return json.dumps(DB)


@app.route('/data')
def data_json():
    data = {}
    data['states'] = DB['states']
    data['stories'] = []
    for story_id in DB['stories']:
        story = DB['stories'][story_id]
        tasks_by_state = []
        for state in DB['states']:
            _tasks = []
            for task_id in DB['tasks']:
                task = DB['tasks'][task_id]
                if task['story'] == story_id and task['state'] == state['name']:
                    _tasks.append(dict(task, id=task_id))
            tasks_by_state.append(_tasks)
        data['stories'].append({
            'id': story_id,
            'who': story['who'],
            'what': story['what'],
            'why': story['why'],
            'tasks_by_state': tasks_by_state,
        })
    #return Response(json.dumps(data), content_type='text/json')
    return json.dumps(data)

@app.route('/task/rename', methods=['POST'])
def task_rename():
    id = request.values['id']
    new_name = request.values['name']
    return Response('hello')


@app.route('/task/move', methods=['POST'])
def task_move(id):
    id = request.values['id']
    return 'hello'


if __name__ == '__main__':
    app.run(debug=True)
