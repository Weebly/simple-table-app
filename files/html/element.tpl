<div class="simple-table-wrapper">
  <table class="simple-table style-{{style}}">
    {{#rows_each}}
      <tr>
        {{#columns_each}}
          <td class="cell">{textAt_{{rows_index}}_{{columns_index}}:text default="Value"}</td>
        {{/columns_each}}
      </tr>
    {{/rows_each}}
  </table>
</div>