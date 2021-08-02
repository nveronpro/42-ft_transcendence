import { Type } from '@nestjs/common';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Module } from '@nestjs/core/injector/module';
import { ModulesContainer } from '@nestjs/core/injector/modules-container';
import { Oauth2GrantStrategyInterface } from "./oauth2-grant-strategy.interface";
export declare const OAUTH2_STRATEGY_METADATA = "__oauth2GrantStrategy__";
export interface Oauth2StrategyOptions {
    strategies: Type<Oauth2GrantStrategyInterface>[];
}
export declare class StrategyExplorer {
    private readonly modulesContainer;
    constructor(modulesContainer: ModulesContainer);
    explore(): Oauth2StrategyOptions;
    flatMap<T>(modules: Module[], callback: (instance: InstanceWrapper) => Type<any> | undefined): Type<T>[];
    filterProvider(wrapper: InstanceWrapper, metadataKey: string): Type<any> | undefined;
    extractMetadata(instance: Object, metadataKey: string): Type<any>;
}
