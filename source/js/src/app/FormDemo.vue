<template>
<div id="form-demo" style="width: 50%; margin: 0 auto;">
    <form-component ref="form" :model="form" label-width="120px" label-position="left" :rules="rules">
        <form-item label="Activity name" prop="name">
            <input-field v-model="form.name" placeholder="Enter your activity name"></input-field>
        </form-item>
        <form-item label="Activity zone" prop="region">
            <select-component v-model="form.region" placeholder="please select your zone" clearable>
            <select-option label="Zone one" value="shanghai"></select-option>
            <select-option label="Zone two" value="beijing"></select-option>
            </select-component>
        </form-item>
        <!--<form-item label="Activity time">
            <col :span="11">
            <date-picker type="date" placeholder="Pick a date" v-model="form.date1" style="width: 100%;"></date-picker>
            </col>
            <col class="line" :span="2">-</col>
            <col :span="11">
            <time-picker type="fixed-time" placeholder="Pick a time" v-model="form.date2" style="width: 100%;"></time-picker>
            </col>
        </form-item>-->
        <!--<form-item label="Instant delivery">
            <switch on-text="" off-text="" v-model="form.delivery"></switch>
        </form-item>-->
        <form-item label="Activity type" prop="type">
            <checkbox-group v-model="form.type">
                <checkbox id="'online-activities'" label="Online-activities" name="type"></checkbox>
                <checkbox id="'promotion-activities'" label="Promotion-activities" name="type"></checkbox>
                <checkbox id="'offline-activities'" label="Offline-activities" name="type"></checkbox>
                <checkbox id="'brand-exposure'" label="Simple-brand-exposure" name="type"></checkbox>
            </checkbox-group>
        </form-item>
        <form-item label="Resources">
            <radio-group v-model="form.resource">
                <radio id="sponsor" label="Sponsor"></radio>
                <radio id="venue" label="Venue"></radio>
            </radio-group>
        </form-item>
        <form-item label="Activity form">
            <input-field type="textarea" v-model="form.desc" placeholder="Describe your activity" autosize></input-field>
        </form-item>
        <button class="button button_color-primary" type="primary" @click="onSubmit"><span class="button__text">Create</span></button>
        <button class="button button_color-accent"><span class="button__text">Cancel</span></button>
    </form-component>
</div>
</template>


<script>
import Radio from './atoms/Radio/Radio.vue'; 
import RadioGroup from './atoms/Radio/RadioGroup.vue';
import Checkbox from './atoms/Checkbox/Checkbox.vue';
import CheckboxGroup from './atoms/Checkbox/CheckboxGroup.vue';
import InputField from './molecules/InputField/InputField';
import Select from './molecules/EnhancedSelect/EnhancedSelect.vue';
import Option from './molecules/EnhancedSelect/Option.vue';
import OptionGroup from './molecules/EnhancedSelect/OptionGroup.vue';
import Form from './organisms/Form/Form.vue';
import FormItem from './organisms/Form/FormItem.vue';

  export default {
    data() {
      return {
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        rules: {
            name: [
                {required: true, message: 'Please input Activity name', trigger: 'blur'},
                {min: 3, message: 'At least 3 characters are required', trigger: 'change'}
            ],
            region: [
                {required: true, message: 'Please select Activity zone', trigger: 'change'}
            ],
            type: [
                {type: 'array', required: true, message: 'Please select at least one activity type', trigger: 'change'}
            ]
        }
      }
    },
    components: {
        'input-field': InputField,
        'radio': Radio,
        'radio-group': RadioGroup,
        'checkbox': Checkbox,
        'checkbox-group': CheckboxGroup,
        'select-component': Select,
        'option-group': OptionGroup,
        'select-option': Option,
        'form-component': Form,
        'form-item': FormItem
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      }
    }
  }
</script>

<style lang="scss">
#form-demo {
    .checkbox-group {
        .checkbox {
            display: inline-block;
            width: 45%;                   
        }
    }
    .radio-group {        
        .radio {
            margin: 10px 0 0 0;
            display: inline-block;
            width: 45%;                   
        }
    }
    .select {
        max-width: 100%;
    }
    .form-item {
        position: relative;

        .form-item__label {
            z-index: 2;
            background: white;
            padding: 12px 6px 12px 6px;
            // color: #BC61A8; // nth($pe-primary-color-list, 3)
            color: #505050;
            font-family: "cabinbold";
        }
    }

    .form {    
        &_label-left {
            .form-item {
                padding: 20px 10px;
                margin: 10px 0;
            }
            .form-item__label {
                left: 0;
                text-align: left;
            }
        }
        &_label-right {
            .form-item {
                padding: 20px 10px;
                margin: 10px 0;
            }
            .form-item__label {
                left: 0;
                text-align: right;                
            }
        }  
        &_label-top {
            .form-item {
                padding: 20px 10px;
                margin: 30px 0;
                border-top: 1px solid transparentize(#b6b6b6, 0.5); // nth($pe-greyscale-color-list, 4);
                border-radius: 0px; 
            }
            .form-item__label {
                top: -25px;
            }
        }
    }
}



</style>