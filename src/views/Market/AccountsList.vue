<template>
    <div>
        <a-card title="Accounts">

            <div class="search mb15"></div>
            <div class="action mb15">
                <a-button type="primary" @click="createAccount">Create Account</a-button>
            </div>
            
            <a-table :data-source="tableData.data">
                <a-table-column title="마켓명" dataIndex="name" key="name"></a-table-column>
                <a-table-column title="Name" dataIndex="age" key="age"></a-table-column>
                <a-table-column title="편집" dataIndex="address" key="address"></a-table-column>
            </a-table>
        </a-card>
    </div>
</template>

<script setup>
import { reactive } from 'vue';


const tableData = reactive({

    data: [
        {
            key: '1',
            name: '胡彦斌',
            age: 32,
            address: '西湖区湖底公园1号',
        },
        {
            key: '2',
            name: '胡彦祖',
            age: 42,
            address: '西湖区湖底公园1号',
        },
    ],

})
</script>

<style lang="scss" scoped></style>