var CellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 2
    });

var RowEditing = Ext.create('Ext.grid.plugin.RowEditing',{
    clicksToEdit: 2,
    pluginId: 'RowEditing',
    listeners: {
        cancelEdit: function(rowEditing, context) {
            // Canceling editing of a locally added, unsaved record: remove it
            if (context.record.phantom) {
                var store = Ext.data.StoreManager.lookup('Daily_outputs');
                store.remove(context.record);
            }
        }
    }
});



Ext.define('helloext.view.daily_output_grid', {
	extend: 'Ext.grid.Panel',

	alias:'widget.daily_output_grid',

    id: 'doGrid',
    
    xtype: 'locking-grid',

    selType: 'rowmodel',

    layout: 'fit',
    
    loadMask    : true,

    plugins: [ /*CellEditing,*/ RowEditing ],

    features: [{
        ftype: 'summary'
    }],

    columnLines : true,
    
    multiSelect : true,
    
    viewConfig  : {
        stripeRows          : true,
        enableTextSelection : true
    },

    forceFit: true,

    autoScroll: true,

    store:  'Daily_outputs', //store = colletion

    columns : [
        { text: 'ID',  dataIndex: 'id', locked   : true, summaryRenderer:function () {return '<b>Total<b/>'} },

        {text: 'line_name',  dataIndex: 'line_name', editor: 'textfield' , field: {xtype: 'textfield'} },

        {
            text: 'time',
            field: {
                xtype: 'combobox', 
                store: 'timeCombos',
                displayField:'name',
                valueField:'name',
                queryMode: 'local' 
            }, 
            dataIndex: 'time'
        },

        {
            text: 'Minute',
            dataIndex: 'minute' ,
            field: {
                xtype: 'numberfield',
                id:'edtMinute',
                maxValue:60,
                listeners:{
                    change: function (editor, value){
                        
                        myGrid = this.up('grid'); //ambil ke atas.
                        if(value != ""){
                            //get edtPlusMinus
                            edtMinute = value;//myGrid.getPlugin('RowEditing').editor.down('numberfield[name=minute]');
                            edtTargetSop = myGrid.getPlugin('RowEditing').editor.down('numberfield[name=target_sop]');
                            edtOscOutput = myGrid.getPlugin('RowEditing').editor.down('numberfield#edtOscOutput');
                            edtPlusMinus = myGrid.getPlugin('RowEditing').editor.down('numberfield[name=plus_minus]');
                            edtLostHour = myGrid.getPlugin('RowEditing').editor.down('numberfield[name=lost_hour]');

                            if(edtOscOutput.value == "" || edtOscOutput.value == null || edtTargetSop.value == "" || edtTargetSop.value == null ){
                                // console.log('false')
                                return false;
                            }

                            hasilPlusMinus = (edtOscOutput.value - ( ( edtMinute / 60) * edtTargetSop.value ) );
                            lostHour = ( hasilPlusMinus / edtTargetSop.value );
                            edtPlusMinus.setValue(hasilPlusMinus);
                            edtLostHour.setValue(lostHour);

                            // console.log({edtMinute: edtMinute.value, edtTargetSop: edtTargetSop.value,edtPlusMinus: edtPlusMinus.value, hasil})
                        }
                    }
                } 
            },
            summaryType: 'sum',
            dock:'bottom',
            summaryRenderer: function (value){
                if (value === null || value === "") {
                     value = 0;
                   }                
                return value;
            }
            
        },

        {   
            text: 'Target Sop',
            dataIndex: 'target_sop',
            summaryType: 'sum',
            dock:'bottom',
            field: {
                xtype: 'numberfield',
                id:'edtTargetSop',
                listeners:{
                    change: function (editor, value){
                        
                        myGrid = this.up('grid'); //ambil ke atas.
                        // console.log('value')
                        if(value != ""){
                            //get edtPlusMinus
                            edtMinute = myGrid.getPlugin('RowEditing').editor.down('numberfield[name=minute]');
                            edtOscOutput = myGrid.getPlugin('RowEditing').editor.down('numberfield#edtOscOutput');
                            edtPlusMinus = myGrid.getPlugin('RowEditing').editor.down('numberfield[name=plus_minus]');
                            edtLostHour = myGrid.getPlugin('RowEditing').editor.down('numberfield[name=lost_hour]');

                            /*if(edtOscOutput.value == "" || edtMinute.value == ""){
                                console.log('false')
                                return false;
                            }

                            if(edtOscOutput.value == null || edtMinute.value == null){
                                console.log('false')
                                return false;
                            }*/

                            hasilPlusMinus = (edtOscOutput.value - ( ( edtMinute.value / 60) * value ) );
                            lostHour = (hasilPlusMinus / value );

                            edtPlusMinus.setValue(hasilPlusMinus);
                            edtLostHour.setValue(lostHour);

                            // console.log({edtMinute: edtMinute.value, edtTargetSop: edtTargetSop.value,edtPlusMinus: edtPlusMinus.value, hasil})
                        }

                    }
                } 
            },
            summaryRenderer: function (value){
                if (value === null || value === "") {
                     value = 0;
                   }                
                return value;
            }
        },

        {text: 'OCS Output', dataIndex: 'osc_output',summaryType: 'sum', dock:'bottom', 
            field: { xtype: 'numberfield',
                id: 'edtOscOutput',

                listeners:{
                    change: function (editor, value){
                        
                        myGrid = this.up('grid'); //ambil ke atas.
                        
                        //var selectedModel = this.up('grid').getSelectionModel().getSelection()[0];
                        
                        if(value != ""){
                            //get edtPlusMinus
                            edtMinute = myGrid.getPlugin('RowEditing').editor.down('textfield[name=minute]');
                            edtTargetSop = myGrid.getPlugin('RowEditing').editor.down('textfield[name=target_sop]');
                            edtPlusMinus = myGrid.getPlugin('RowEditing').editor.down('textfield[name=plus_minus]');
                            edtLostHour = myGrid.getPlugin('RowEditing').editor.down('textfield[name=lost_hour]');

                            hasilPlusMinus = (value - ( ( edtMinute.value / 60) * edtTargetSop.value ) );
                            lostHour = (hasilPlusMinus / edtTargetSop.value );

                            edtPlusMinus.setValue(hasilPlusMinus);
                            edtLostHour.setValue(lostHour);
                        }

                    }
                } 
            },
            summaryRenderer: function (value){
                if (value === null || value === "") {
                     value = 0;
                   }                
                return value;
            } 
        },

        {
            text: 'Plus Minus',
            dataIndex: 'plus_minus',
            summaryType: 'sum',
            dock:'bottom',
            field: {
                xtype: 'numberfield',
                decimalPrecision: 2,
                id: 'edtPlusMinus'
            },
            summaryRenderer: function (value){
                if (value === null || value === "") {
                    value = 0;
                }                
                return value;
            }   
        },

        {
            text: 'Lost Hours', 
            dataIndex: 'lost_hour', 
            summaryType: 'sum',
            decimalPrecision: 2,
            dock:'bottom',
            field: {xtype: 'numberfield', decimalPrecision: 2}
        },

        {
            text: 'DELAY TYPE',
            columns:[
                {text: 'BOARD <br> DELAY', dataIndex: 'board_delay', field: {xtype: 'numberfield', dataIndex: 'board_delay', step:0.01, decimalPrecision:2}, summaryType: 'sum', dock:'bottom' },
                {text: 'PART <br> DELAY', dataIndex: 'part_delay', field: {xtype: 'numberfield',step:0.01,decimalPrecision:2}, summaryType: 'sum', dock:'bottom' },
                {text: 'EQP <br> TROUBLE', dataIndex: 'eqp_trouble', field: {xtype: 'numberfield',step:0.01,decimalPrecision:2}, summaryType: 'sum', dock:'bottom' },
                {text: 'QUALITY <br> PROB', dataIndex: 'quality_problem_delay', field: {xtype: 'numberfield',step:0.01,decimalPrecision:2}, summaryType: 'sum', dock:'bottom'},
                {text: 'BAL. <br> PROB', dataIndex: 'bal_problem', field: {xtype: 'numberfield',step:0.01,decimalPrecision:2}, summaryType: 'sum', dock:'bottom' },
                {text: 'OTHERS', dataIndex: 'others' , field: {xtype: 'numberfield',step:0.01,decimalPrecision:2}, summaryType: 'sum', dock:'bottom' },
                {text: 'SUPPORT', dataIndex: 'support', field: {xtype: 'numberfield',step:0.01,decimalPrecision:2}, summaryType: 'sum', dock:'bottom' },
                {text: 'CHANGE <br> MODEL', dataIndex: 'change_model', field: {xtype: 'numberfield',step:0.01,decimalPrecision:2}, summaryType: 'sum', dock:'bottom' }
            ]
        },
        
        {text: 'Problem',editor: 'textareafield', dataIndex: 'problem',field: {xtype: 'textarea',emptyText:'Problem Causing the Delay',  height: 25/*, resizable:true*/}},

        {text: 'DIC', dataIndex: 'dic',field: {xtype: 'textfield', emptyText:'Department In Charge' }},

        {text: 'Action',editor: 'textareafield', dataIndex: 'action',field: {xtype: 'textarea', emptyText:'Action yang diambil' , height: 25}}

        // {text: 'users_id', dataIndex: 'users_id',field: {xtype: 'textfield'}},

        // {text: 'shift', dataIndex: 'shift', field: {xtype: 'textfield', disabled:true}},

        /*{text: 'tanggal', dataIndex: 'tanggal', field: {
            xtype: 'datefield',
            format: 'Y-m-d',          
            allowBlank: true,
            emptyText:'yyyy-mm-dd',
            disabled: true
        }}*/

    ]

    

});