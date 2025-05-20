<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['update:visible','editCategories']);

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    categories: {
        type: Array,
        required: true
    }
});

const localCategories = ref(props.categories);
const newCategory = ref("");

function hide() {
    emit('update:visible',false);
}

function closeDialog() {
    hide();
}

function ok() {
    console.log("submitHandler");
    emit('editCategories', localCategories.value);
    hide();
}

function addItem() {
    if (newCategory.value !== "") {
        localCategories.value.push(newCategory.value);
        newCategory.value = "";
    }
}

function deleteItem(index: number) {
    console.log("deleteItem: ", index);
    localCategories.value.splice(index,1);

}
</script>

<template>
    <BModal
        v-model="props.visible"
        centered
        ok-title="Save" title="Edit Categories" @ok="ok">
        <BListGroup>
            <BListGroupItem v-for="catItem,cindex in localCategories">{{ catItem }} <IBiX class="p" @click="deleteItem(cindex)"/></BListGroupItem>
        </BListGroup>
        <BFormGroup class="input-group my-3">
            <BFormInput v-model="newCategory" placeholder="Enter a new category" />
            <BButton @click="addItem">Add</BButton>
        </BFormGroup>


    </BModal>

</template>