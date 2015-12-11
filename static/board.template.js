<table id="board">
    <thead>
        <tr>
            <th>User Story</th>
            {{#each states}}
            <th>{{ this.label }}</th>
            {{/each}}
        </tr>
    </thead>
    <tbody>
    {{#each stories}}
        <tr id="story_{{ id }}">
            <td class="story">
                <strong>As</strong> {{ who }}<br>
                <strong>I want</strong> {{ what }}</br>
                <strong>In order to</strong> {{ why }}
            </td>
            {{#each tasks_by_state}}
                <td>
                    {{#each this}}
                        <div class="card" id="{{ id }}" draggable="true">{{ summary }}</div>
                    {{/each}}
                </td>
            {{/each}}
        </tr>
    {{/each}}
    </tbody>
</table>
